import getSession from "@/utils/getSession";
import { NextRequest } from "next/server";
import prisma from "@/utils/prismaClient";

export async function POST(request: NextRequest) {
  const req = await request.json();

  const sessionList: Array<Date> = req.sessionList;

  if (
    !sessionList
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

  sessionList.forEach(async (sessionCreationDate) => {
    await prisma.session.deleteMany({
      where: {
        AND: [
          {
            userId: session.userId, 
          },
          {
            createdAt: sessionCreationDate,
          },
        ],
      },
    });
  });

  return new Response("Session kicked.");
}