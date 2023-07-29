import getSession from "@/utils/getSession";
import { NextRequest } from "next/server";
import prisma from "@/utils/prismaClient";

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get("sessionId")?.value;
  const session = await getSession(sessionId || null);

  if (!session) {
    return new Response("Not logged in!", {
      status: 401,
    });
  }

  const req = await request.json();

  if (
    !req.notepadId
  ) {
    return new Response("Invalid form data.", {
      status: 422,
    });
  }

  const notepad = await prisma.notepad.findUnique({
    where: {
      id: req.notepadId,
    },
  }) || null;

  if (!notepad) {
    return new Response("No notepad found!", {
      status: 404,
    });
  }

  if (notepad.isPublic) {
    return new Response(JSON.stringify({ notepad: notepad, userId: session.userId, }));
  }

  if (!notepad.isPublic && notepad.authorId !== session.userId) {
    return new Response("You don't have access to this!", {
      status: 401,
    });
  }
}