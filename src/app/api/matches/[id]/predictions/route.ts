import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        predictions: {
          include: { user: { select: { username: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!match) return Response.json({ error: "Match introuvable" }, { status: 404 });

    const total = match.predictions.length;
    const teamAVotes = match.predictions.filter((p) => p.winner === "teamA").length;
    const teamBVotes = total - teamAVotes;

    const votes = match.predictions.map((p) => ({
      id: p.id,
      username: p.user.username,
      winner: p.winner,
      scoreA: p.scoreA,
      scoreB: p.scoreB,
      points: p.points,
      teamA: match.teamA,
      teamB: match.teamB,
    }));

    return Response.json({
      total,
      teamA: match.teamA,
      teamB: match.teamB,
      teamAPct: total ? Math.round((teamAVotes / total) * 100) : 0,
      teamBPct: total ? Math.round((teamBVotes / total) * 100) : 0,
      votes,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
