import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { score: "desc" },
    select: {
      id: true,
      username: true,
      score: true,
      correctPredictions: true,
      exactPredictions: true,
      wrongPredictions: true,
    },
  });
  return Response.json(users);
}
