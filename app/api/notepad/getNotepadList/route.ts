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

  const notepads = await prisma.notepad.findMany({
    where: {
      authorId: session.userId,
    },
    select: {
      id: true,
      title: true,
      titleAuthTag: true,
      content: false,
      createdAt: true,
      isPublic: true,
      iv: true,
      lastEdited: true,
    },
  }) || null;

  if (!notepads) {
    return new Response("No notepads found.", {
      status: 404,
    });
  }

  return new Response(JSON.stringify(notepads));
}