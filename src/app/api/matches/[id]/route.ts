import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.name) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.name !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { winner, scoreA, scoreB, locked } = await req.json();
    const { id } = await params;

    const match = await prisma.match.update({
      where: { id },
      data: {
        winner,
        scoreA: scoreA === undefined ? undefined : Number(scoreA),
        scoreB: scoreB === undefined ? undefined : Number(scoreB),
        locked: locked === undefined ? undefined : Boolean(locked),
      },
      include: { predictions: true },
    });

    if (winner && scoreA !== undefined && scoreB !== undefined) {
      const correctWinner = winner;
      const correctScoreA = Number(scoreA);
      const correctScoreB = Number(scoreB);
      const isBo1 = match.format === "BO1";
      const exactBonus = isBo1 ? 1 : 2;

      for (const p of match.predictions) {
        let points = 0;
        const winnerCorrect = p.winner === correctWinner;
        const scoreExact = p.scoreA === correctScoreA && p.scoreB === correctScoreB;

        if (winnerCorrect) points += 1;
        if (winnerCorrect && scoreExact) points += exactBonus;

        await prisma.prediction.update({
          where: { id: p.id },
          data: { points },
        });
      }

      const users = await prisma.user.findMany({ include: { predictions: true } });
      for (const u of users) {
        const total = u.predictions.reduce((sum, pred) => sum + pred.points, 0);
        const correct = u.predictions.filter((pred) => pred.points >= 1).length;
        const exact = u.predictions.filter((pred) => pred.points > 1).length;
        const wrong = u.predictions.length - correct;
        await prisma.user.update({
          where: { id: u.id },
          data: {
            score: total,
            correctPredictions: correct,
            exactPredictions: exact,
            wrongPredictions: wrong,
          },
        });
      }
    }

    return Response.json(match);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.name) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.name !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await params;
    await prisma.match.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
