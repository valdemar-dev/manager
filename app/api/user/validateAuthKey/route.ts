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
    !req.password
  ) {
    return new Response("Invalid form data.", {
      status: 422,
    });
  }

  const userInDb = await prisma.user.findFirst({
    where: {
      AND: [
        {
          id: session.userId,
        }, 
        {
          password: req.password,
        },
      ],
    },
  }) || null;

  if (!userInDb) {
    return new Response("No user found!", {
      status: 404,
    });
  }

  return new Response(JSON.stringify(userInDb.email));
}