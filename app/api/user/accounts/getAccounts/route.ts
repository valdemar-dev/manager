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

  const userInDb = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
    select: {
      accounts: true,
    },
  }) || null;

  if (!userInDb) {
    return new Response("User not found!", {
      status: 404,
    });
  }

  return new Response(JSON.stringify(userInDb.accounts));
}