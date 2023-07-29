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

  const notepad = await prisma.notepad.findFirst({
    where: {
      AND: [
        {
          id: req.notepadId,
        },
        {
          authorId: session.userId,
        },
      ],
    },
  }) || null;

  if (!notepad) {
    return new Response("No notepad found!", {
      status: 404,
    });
  }

  return new Response(JSON.stringify(notepad));
}