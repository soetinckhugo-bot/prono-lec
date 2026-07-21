import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_SPLIT = "LEC Summer 2026";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const predictions = await prisma.prediction.findMany({
      where: { userId: session.user.id },
      include: { match: true },
      orderBy: { createdAt: "desc" },
    });

    const splitPredictions = predictions.filter((p) => p.match.split === DEFAULT_SPLIT);

    const total = splitPredictions.length;
    const correct = splitPredictions.filter((p) => p.points >= 1).length;
    const exact = splitPredictions.filter((p) => p.points > 1).length;
    const wrong = total - correct;

    const splitStats = {
      total,
      correct,
      exact,
      wrong,
      correctPct: total ? Math.round((correct / total) * 100) : 0,
      exactPct: total ? Math.round((exact / total) * 100) : 0,
      wrongPct: total ? Math.round((wrong / total) * 100) : 0,
    };

    const teamMap = new Map<string, { team: string; played: number; correct: number }>();

    for (const p of splitPredictions) {
      const teams = [p.match.teamA, p.match.teamB];
      for (const team of teams) {
        const entry = teamMap.get(team) || { team, played: 0, correct: 0 };
        entry.played += 1;
        if (p.points >= 1) entry.correct += 1;
        teamMap.set(team, entry);
      }
    }

    const teamStats = Array.from(teamMap.values())
      .map((t) => ({ ...t, pct: t.played ? Math.round((t.correct / t.played) * 100) : 0 }))
      .sort((a, b) => b.pct - a.pct);

    const history = predictions.map((p) => ({
      id: p.id,
      matchId: p.matchId,
      teamA: p.match.teamA,
      teamB: p.match.teamB,
      format: p.match.format,
      split: p.match.split,
      winner: p.match.winner,
      scoreA: p.match.scoreA,
      scoreB: p.match.scoreB,
      predictionWinner: p.winner,
      predictionScoreA: p.scoreA,
      predictionScoreB: p.scoreB,
      points: p.points,
      scheduledAt: p.match.scheduledAt,
    }));

    return Response.json({ split: DEFAULT_SPLIT, splitStats, teamStats, history });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
