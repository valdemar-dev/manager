import getSession from "@/utils/getSession";
import { NextRequest } from "next/server";

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
      notifications: true,
    },
  }) || null;

  if (!userInDb) {
    return new Response("No user found.", {
      status: 404,
    });
  }

  return new Response(JSON.stringify(userInDb!.notifications));
}