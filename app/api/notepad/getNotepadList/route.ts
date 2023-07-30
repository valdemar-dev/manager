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
      id: session.userId,
    },
    select: {
      id: true,
      title: false,
      content: false,
    },
  }) || null;

  if (!notepads) {
    return new Response("No notepads found.", {
      status: 404,
    });
  }

  return new Response(JSON.stringify(notepads));
}