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
    !req.password || 
    !req.service ||
    !req.usernameAuthTag ||
    !req.emailAuthTag ||
    !req.passwordAuthTag ||
    !req.serviceAuthTag ||
    !req.id
  ) {
    return new Response("Invalid form data.", {
      status: 422,
    });
  }

  await prisma.account.update({
    where: {
      id: req.id,
    },
    data: {
      accountUsername: req.username ? req.username : null,
      accountEmail: req.email ? req.email : null,
      accountPassword: req.password,
      accountService: req.service,
      iv: req.iv,
      usernameAuthTag: req.usernameAuthTag,
      emailAuthTag: req.emailAuthTag,
      passwordAuthTag: req.passwordAuthTag,
      serviceAuthTag: req.serviceAuthTag,
    },
  });

  return new Response("Account created.");
}