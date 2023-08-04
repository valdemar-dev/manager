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
    select: {
      ip: true,
      id: true,
      os: true,
      browser: true,
      lastUsedAt: true,
      createdAt: true,
    }
  }) || null;

  if (!sessions) {
    return new Response("No sessions found.", {
      status: 404,
    });
  }

  return new Response(JSON.stringify(sessions));
} 