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
    !req.notepadContent ||
    !req.notepadId || 
    !req.authorUsername ||
    req.isPublic === undefined
  ) {
    return new Response("Invalid form data.", {
      status: 422,
    });
  }

  const titleMaximumLength = 80;
  const contentMaximumLength = 10000;

  if (req.isPublic === false) {
    if (
      !req.titleAuthTag ||
      !req.iv ||
      !req.contentAuthTag ||
      !req.usernameAuthTag
    ) {
      return new Response("Invalid form data.", {
        status: 422,
      });
    }

    // encrypted content is always 2x the unencrypted length
    if (req.notepadTitle.length === titleMaximumLength * 2) {
      return new Response("The maximum length of the title is 80 characters.", {
        status: 422,
      });
    }

    if (req.notepadContent.length > contentMaximumLength * 2) {
      return new Response("The notepads contents length must not exceed 10 thousand characters.", {
        status: 422,
      });
    }

    await prisma.notepad.updateMany({
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
      data: {
        title: req.notepadTitle,
        content: req.notepadContent,
        titleAuthTag: req.titleAuthTag,
        contentAuthTag: req.contentAuthTag,
        usernameAuthTag: req.usernameAuthTag,
        authorUsername: req.authorUsername,

        iv: req.iv,
      }
    }) || null;

    return new Response("Updated notepad.")
  }

  await prisma.notepad.updateMany({
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
    data: {
      title: req.notepadTitle,
      content: req.notepadContent,
      authorUsername: req.authorUsername,
      lastEdited: new Date(),
    },
  }) || null;

  return new Response("Updated notepad!");
}