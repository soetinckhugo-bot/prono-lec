import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password || username.length < 2 || password.length < 4) {
      return Response.json({ error: "Pseudo ou mot de passe invalide" }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { username } });
    if (exists) {
      return Response.json({ error: "Ce pseudo est déjà pris" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { username, passwordHash },
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
