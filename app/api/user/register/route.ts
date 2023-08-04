import prisma from "@/utils/prismaClient";
import crypto from "crypto";
import hashText from "@/utils/hashText";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const req = await request.json();

  if (
    !req.displayname ||
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

  if (
    await prisma.user.findUnique({
      where: {
        email: req.email,
      },
    }) !== null
  ) {
    return new Response("Account already exists!", {
      status: 403,
    });
  }

  const sessionId = crypto.randomBytes(16).toString("hex");
  
  await prisma.user.create({
    data: {
      email: req.email,
      password: req.password,
      profile: {
        create: {
          displayname: req.displayname,
        },
      },
      sessions: {
        create: [
          {
            ip: req.ip,
            browser: req.browser,
            os: req.os,
            id: sessionId,
          },
        ],
      },
    },
  });

  const cookieJar = cookies();

  cookieJar.set("sessionId", sessionId, { secure: true, httpOnly: true, });

  return new Response("Account created!");
}