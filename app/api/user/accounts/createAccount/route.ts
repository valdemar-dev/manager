import getSession from "@/utils/getSession";
import { NextRequest } from "next/server";

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
    !req.username ||
    !req.email ||
    !req.password ||
    !req.service
  ) {
    return new Response("Invalid form data.", {
      status: 422,
    });
  }

  await prisma.user.update({
    where: {
      id: session.userId,
    },
    data: {
      accounts: {
        create: [
          {
            username: req.username,
            email: req.email,
            password: req.password,
            service: req.service,
          }
        ]
      }
    }
  })

return new Response("Created account!");
}