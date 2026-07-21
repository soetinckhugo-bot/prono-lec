import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findUnique({ where: { username: "admin" } });
  if (!admin) {
    await prisma.user.create({
      data: {
        username: "admin",
        passwordHash: await bcrypt.hash("admin123", 10),
        role: "admin",
      },
    });
    console.log("Compte admin créé : admin / admin123");
  } else {
    await prisma.user.update({
      where: { username: "admin" },
      data: { role: "admin" },
    });
    console.log("Compte admin mis à jour");
  }
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
