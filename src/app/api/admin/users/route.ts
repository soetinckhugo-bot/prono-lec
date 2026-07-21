import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      role: true,
      isBanned: true,
      createdAt: true,
      score: true,
    },
  });
  return Response.json(users);
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { userId, isBanned } = await req.json();
    if (!userId || typeof isBanned !== "boolean") {
      return Response.json({ error: "Champs invalides" }, { status: 400 });
    }

    const target = await prisma.user.findUnique({ where: { id: userId } });
    if (!target) return Response.json({ error: "Utilisateur introuvable" }, { status: 404 });
    if (target.role === "admin") return Response.json({ error: "Impossible de bannir un admin" }, { status: 403 });

    await prisma.user.update({
      where: { id: userId },
      data: { isBanned },
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
