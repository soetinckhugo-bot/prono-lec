import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const matches = await prisma.match.findMany({
    orderBy: { scheduledAt: "asc" },
    include: { predictions: true },
  });
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
