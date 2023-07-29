import { NextRequest } from "next/server";
import prisma from "@/utils/prismaClient";
import getSession from "@/utils/getSession";
import hashText from "@/utils/hashText";

export async function POST(request: NextRequest) {
  const req = await request.json();

  if (
    !req.password
  ) {
    return new Response("Invalid form data.", {
      status: 422,
    });
  }

  const sessionId = request.cookies.get("sessionId")?.value;
  const session = await getSession(sessionId || null);

  if (!session) {
    return new Response("Not logged in!", {
      status: 401,
    });
  }

  const password = hashText(req.password).output;

  const userInDb = await prisma.user.findFirst({
    where: {
      AND: [
        {
          password: password,
        },
        {
          id: session.userId,
        },
      ],
    },
  }) || null;

  if (!userInDb) {
    return new Response("Incorrect password! Try again.", {
      status: 403,
    });
  }

  return new Response("Ok.");
}