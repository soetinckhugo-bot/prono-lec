import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { matchId, winner, scoreA, scoreB } = await req.json();
    if (!matchId || !winner || scoreA === undefined || scoreB === undefined) {
      return Response.json({ error: "Champs manquants" }, { status: 400 });
    }

    const match = await prisma.match.findUnique({ where: { id: matchId } });
    if (!match) return Response.json({ error: "Match introuvable" }, { status: 404 });
    if (match.locked) return Response.json({ error: "Les pronos sont verrouillés" }, { status: 403 });

    const prediction = await prisma.prediction.upsert({
      where: {
        userId_matchId: { userId: session.user.id, matchId },
      },
      create: {
        userId: session.user.id,
        matchId,
        winner,
        scoreA: Number(scoreA),
        scoreB: Number(scoreB),
      },
      update: {
        winner,
        scoreA: Number(scoreA),
        scoreB: Number(scoreB),
      },
    });

    return Response.json(prediction);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
