import prisma from "@/utils/prismaClient";
import hashText from "@/utils/hashText";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const req = await request.json();

  if (
    !req.email ||
    !req.password ||
    !req.browser ||
    !req.os ||
    !req.ip
  ) {
    return new Response("Invalid form data.", {
      status: 422,
    })
  }

  const userInDb = await prisma.user.findFirst({
    where: {
      AND: [
        {
          email: req.email,
        },
        {
          password: req.password,
        },
      ],
    },
  }) || null;

  if (!userInDb) {
    return new Response("Invalid username or password!", {
      status: 401,
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
            ip: req.ip,
            browser: req.browser,
            os: req.os,
            id: sessionId,
          },
        ],
      }
    }
  });

  const cookieJar = cookies();

  cookieJar.set("sessionId", sessionId, { secure: true, httpOnly: true, });

  return new Response("Logged in!");
}
