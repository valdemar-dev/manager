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

  let entryTotal: number = 0;

  const userInDb = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
    include: {
      accounts: true,
      notepads: true,
      contacts: true,
      projects: true,
    }
  }) || null;

  if (!userInDb) {
    return new Response("No user found?", {
      status: 404,
    });
  }

  entryTotal += userInDb.accounts.length;
  entryTotal += userInDb.notepads.length;
  entryTotal += userInDb.contacts.length;
  entryTotal += userInDb.projects.length;

  return new Response(JSON.stringify(entryTotal));
}