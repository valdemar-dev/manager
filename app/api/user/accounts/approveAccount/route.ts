import getSession from "@/utils/getSession";
import { NextRequest } from "next/server";
import keyShareManager from "@/utils/keyShareManager";

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
    !req.authKey ||
    !req.id ||
    !req.notificationId
  ) {
    return new Response("Invalid form data", {
      status: 422,
    });
  }

  const key = keyShareManager.getKey(req.authKey).key;

  if (!key) {
    return new Response("Invalid or expired key.", {
      status: 403,
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
    return new Response("User not found", {
      status: 404,
    });
  }

  const account = userInDb.accounts.find(account => account.id === req.id);

  if (!account) {
    return new Response("Account not found with provided id.", {
      status: 404,
    });
  }

  await prisma.account.deleteMany({
    where: {
      id: account.id,
      email: account.email,
      username: account.username,
      password: account.password,
      service: account.service,
      isShared: true,
    },
  });

  await prisma.notification.deleteMany({
    where: {
      id: req.notificationId,
    },
  });

  return new Response(JSON.stringify({ key: key, account: account, }));
}