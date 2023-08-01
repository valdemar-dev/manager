import getSession from "@/utils/getSession";
import { NextRequest } from "next/server";
import prisma from "@/utils/prismaClient";

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get("sessionId")?.value;
  const session = await getSession(sessionId || "");

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
      plan: true,
      role: true,
      password: false,
    },
  }) || null;

  if (!userInDb) {
    return new Response("No user in database.", {
      status: 404,
    });
  }

  if (userInDb.plan === "Free") {
    return new Response("Free user.", {
      status: 403,
    });
  }
  
  return new Response("Ok.");
}