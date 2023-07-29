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
    !req.notepadTitle ||
    !req.authorUsername
  ) {
    return new Response("Invalid form data.", {
      status: 422,
    });
  }

  if (req.isPublic === false) {
    if (
      !req.titleAuthTag ||
      !req.iv ||
      !req.notepadContent ||
      !req.contentAuthTag ||
      !req.usernameAuthTag
    ) {
      return new Response("Invalid form data.", {
        status: 422,
      });
    }

    const notepad = await prisma.notepad.create({
      data: {
        title: req.notepadTitle,
        titleAuthTag: req.titleAuthTag,
        content: req.notepadContent,
        contentAuthTag: req.contentAuthTag,
        iv: req.iv,
        authorId: session.userId,
        isPublic: false,
        usernameAuthTag: req.usernameAuthTag,
        authorUsername: req.authorUsername,
      },
    });

    return new Response(JSON.stringify({ text: "Created notepad.", notepadId: notepad.id }))
  }

  const notepad = await prisma.notepad.create({
    data: {
      title: req.notepadTitle,
      authorId: session.userId,
      isPublic: req.isPublic,
      authorUsername: req.authorUsername
    }
  });

  const resObject = {
    text: "Created notepad!",
    notepadId: notepad.id,
  };

  return new Response(JSON.stringify(resObject));
}