import getSession from "@/utils/getSession";
import { NextRequest } from "next/server";
import prisma from "@/utils/prismaClient";

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get("sessionId")?.value;

  const session = await getSession(sessionId || null);

  if (!session) {
    return new Response("Not logged in!", {
      status: 401,
    });
  }

  const userInDb = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
    select: {
      password: false,
      createdAt: true,
      role: true,
      plan: true,
    },
  }) || null;

  if (!userInDb) {
    return new Response("Not logged in!", {
      status: 401,
    });
  }

  return new Response(JSON.stringify(userInDb));
}