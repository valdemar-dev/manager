import getSession from "@/utils/getSession";
import { NextRequest } from "next/server";
import prisma from "@/utils/prismaClient";

export async function POST(request: NextRequest) {
  const req = await request.json();

  const sessionId = request.cookies.get("sessionId")?.value;
  const session = await getSession(sessionId || null);

  if (!session) {
    return new Response("Not logged in!", {
      status: 401,
    });
  }

  if (
    !req.sessionId
  ) {
    return new Response("Invalid form data, or not logged in.", {
      status: 422,
    });
  }

  await prisma.session.deleteMany({
    where: {
      AND: [
        {
          id: req.sessionId,
        },
        {
          userId: session.userId,
        },
      ],
    },
  });
  
  return new Response("Session kicked.");
}