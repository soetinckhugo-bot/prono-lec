import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function franceDayKey(date: Date) {
  return new Date(date).toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" });
}

export async function GET() {
  let matches = await prisma.match.findMany({
    orderBy: { scheduledAt: "asc" },
    include: { predictions: true },
  });

  const now = new Date();
  const byDay = new Map<string, typeof matches>();
  for (const m of matches) {
    const key = franceDayKey(m.scheduledAt);
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key)!.push(m);
  }

  const toLock: string[] = [];
  for (const dayMatches of byDay.values()) {
    const first = dayMatches.sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())[0];
    const lockTime = new Date(first.scheduledAt.getTime() - 15 * 60 * 1000);
    if (now >= lockTime) {
      for (const m of dayMatches) {
        if (!m.locked) toLock.push(m.id);
      }
    }
  }

  if (toLock.length > 0) {
    await prisma.match.updateMany({
      where: { id: { in: toLock } },
      data: { locked: true },
    });
    matches = await prisma.match.findMany({
      orderBy: { scheduledAt: "asc" },
      include: { predictions: true },
    });
  }

  return Response.json(matches);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.name) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const isAdmin = session.user.name === "admin";
  if (!isAdmin) return Response.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { teamA, teamB, format, split, scheduledAt } = await req.json();
    if (!teamA || !teamB || !format) {
      return Response.json({ error: "Champs manquants" }, { status: 400 });
    }

    const match = await prisma.match.create({
      data: {
        teamA,
        teamB,
        format,
        split,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
      },
    });
    return Response.json(match);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
