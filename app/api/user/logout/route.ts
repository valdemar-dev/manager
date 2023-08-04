import prisma from "@/utils/prismaClient";
import hashText from "@/utils/hashText";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import crypto from "crypto";
import getSession from "@/utils/getSession";

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get("sessionId")?.value;
  const session = await getSession(sessionId || "");

  if (!session) {
    return new Response("Not logged in!");
  }

  await prisma.session.deleteMany({
    where: {
      AND: [
        {
          id: sessionId,
        },
        {
          userId: session.userId,
        },
      ],
    },
  });
  
  return new Response("Logged out!");
}
