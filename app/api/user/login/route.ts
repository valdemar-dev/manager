import prisma from "@/utils/prismaClient";
import hashText from "@/utils/hashText";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const req = await request.json();

  if (
    !req.username ||
    !req.email ||
    !req.password ||
    !req.browserName ||
    !req.os
  ) {
    return new Response("Invalid form data.", {
      status: 422,
    })
  }

  const username: string = hashText(req.username).output;
  const email: string = hashText(req.email).output;
  const password: string = hashText(req.password).output;

  const userInDb = await prisma.user.findFirst({
    where: {
      AND: [
        {
          username: username,
        },
        {
          email: email,
        },
        {
          password: password,
        },
      ],
    },
  }) || null;

  if (!userInDb) {
    return new Response("Incorrect login information.", {
      status: 422,
    });
  }

  let userIp!: string;
  if (request.headers.get('x-forwarded-for') !== null) {
    userIp = request.headers.get('x-forwarded-for')?.split(',')[0] || "noIp";
  } else if (request.headers.get('x-real-ip')) {
    userIp = "noIp";
  }

  const sessions = await prisma.session.findMany({
    where: {
      userId: userInDb.id,
    },
    orderBy: {
      lastActive: 'asc',
    },
  });

  if (sessions.length === 10) {
    const sessionToDelete = sessions[0];

    await prisma.session.delete({
      where: {
        id: sessionToDelete.id,
      },
    });
  }
 
  const sessionId = crypto.randomBytes(16).toString("hex");

  await prisma.user.update({
    where: {
      id: userInDb.id,
    },
    data: {
      sessions: {
        create: [
          {
            id: sessionId,
            sessionBrowser: req.browserName,
            os: req.os,
            userIp: `${userIp}`,
          },
        ],
      },
    },
  });

  const cookieStore = cookies();
  cookieStore.set("sessionId", sessionId)

  return new Response("Logged in!");
}
