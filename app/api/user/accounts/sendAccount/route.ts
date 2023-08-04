import getSession from "@/utils/getSession";
import { NextRequest } from "next/server";
import keyShareManager from "@/utils/keyShareManager";
import crypto from "crypto";

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
    !req.email ||
    !req.authKey ||
    !req.accountUsername ||
    !req.accountEmail ||
    !req.accountPassword ||
    !req.accountService ||
    !req.displayname
  ) {
    return new Response("Invalid form data.", {
      status: 422,
    });
  }

  const keyShareAuthKey = crypto.randomBytes(16).toString("hex");

  const userInDb = await prisma.user.findUnique({
    where: {
      email: req.email,
    },
  }) || null;

  if (!userInDb) {
    return new Response("User not found.", {
      status: 404,
    });
  }

  if (userInDb.id === session.userId) {
    return new Response("You cannot share an account to yourself.", {
      status: 401,
    });
  }

  const uuid = crypto.randomUUID();

  await prisma.user.update({
    where: {
      email: req.email,
    },
    data: {
      accounts: {
        create: [
          {
            id: uuid,
            username: req.accountUsername,
            email: req.accountEmail,
            password: req.accountPassword,
            service: req.accountService,
            isShared: true,
          },
        ],
      },
      notifications: {
        create: [
          {
            title: `${req.displayname} would like to share an account with you.`,
            type: "accountShare",
            data: JSON.stringify({ key: keyShareAuthKey, id: uuid }),
          }
        ]
      }
    },
  });

  keyShareManager.addKey(req.authKey, keyShareAuthKey);

  return new Response("Account shared!");
}