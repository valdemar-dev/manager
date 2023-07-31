import getSession from "@/utils/getSession";
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import premiumUsers from "@/premiumUsers.json";
import prisma from "@/utils/prismaClient";

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get("sessionId")?.value;
  const session = await getSession(sessionId || "");

  if (!session) {
    return new Response("Not logged in!", {
      status: 401,
    });
  }

  if (premiumUsers.includes(session.userId)) {
    return new Response("Ok.");
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

  //cache userid to save on database reads
  premiumUsers.push(session.userId);
  fs.writeFileSync(path.join(process.cwd(), "premiumUsers.json"), JSON.stringify(premiumUsers));
  
  return new Response("Ok.");
}