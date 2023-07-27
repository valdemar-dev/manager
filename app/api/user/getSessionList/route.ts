import { NextRequest } from "next/server";
import prisma from "@/utils/prismaClient";
import getSession from "@/utils/getSession";

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get("sessionId")?.value;

  const session = await getSession(sessionId || null);

  if (!session) {
    return new Response("Not logged in!", {
      status: 401,
    });
  }

  const sessions = await prisma.session.findMany({
    where: {
      userId: session.userId,
    },
    orderBy: {
      lastActive: 'desc',
    },

    select: {
      sessionBrowser: true,
      os: true,
      userIp: true,
      lastActive: true,
      createdAt: true,
      id: false,
    },
  });

  const userInDb = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
  }) || null;

  if (
    userInDb.role === "Beta" ||
    userInDb.role === "Admin" 
  ) {
    sessions.forEach((session: any) => {
      session.userIp = "Withheld for privacy";
    });
  }

  return new Response(JSON.stringify(sessions));
} 