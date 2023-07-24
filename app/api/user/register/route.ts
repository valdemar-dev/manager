import prisma from "@/utils/prismaClient";
import crypto from "crypto";
import hashText from "@/utils/hashText";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

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
      OR: [
        {
          username: username,
        },
        {
          email: email,
        },
      ]
    }
  }) || null;

  if (userInDb) {
    return new Response("A user with this username and or email address already exists!", {
      status: 409
    });
  }

  await prisma.user.create({
    data: {
      username: username,
      email: email,
      password: password,
    },
  });

  // handle login so the user doesnt have to register and also login
  let userIp!: string;
  if (request.headers.get('x-forwarded-for') !== null) {
    userIp = request.headers.get('x-forwarded-for')?.split(',')[0] || "noIp";
  } else if (request.headers.get('x-real-ip')) {
    userIp = request.ip?.toString() || "noIp";
  }

  const sessionId = crypto.randomBytes(16).toString("hex");

  await prisma.user.update({
    where: {
      username: username,
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

  return new Response("Registered account!")
}