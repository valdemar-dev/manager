import prisma from "./prismaClient";

const getSession = async (sessionId: string | null) => {
  const sessionInDb = await prisma.session.findUnique({
    where: {
      id: sessionId || "",
    },
  }) || null;

  if (!sessionInDb) return false;

  await prisma.session.update({
    where: {
      id: sessionId,
    },
    data: {
      lastUsedAt: new Date(),
    },
  });

  return sessionInDb
};

export default getSession;