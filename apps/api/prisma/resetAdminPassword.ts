import "dotenv/config";

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as argon2 from "argon2";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined.");
}

const ca = readFileSync(
  resolve(process.cwd(), "certs/prod-ca-2021.crt"),
  "utf8",
);

const adapter = new PrismaPg({
  connectionString,
  ssl: {
    ca,
  },
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required.");
  }

  if (/\s/.test(adminPassword)) {
    throw new Error("ADMIN_PASSWORD must not contain whitespace.");
  }

  if (adminPassword.length < 12) {
    throw new Error("ADMIN_PASSWORD must have at least 12 characters.");
  }

  const admin = await prisma.user.findUnique({
    where: {
      email: adminEmail,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  if (!admin) {
    throw new Error("Admin user was not found.");
  }

  if (admin.role !== "ADMIN") {
    throw new Error("The user is not an ADMIN.");
  }

  const passwordHash = await argon2.hash(adminPassword, {
    type: argon2.argon2id,
  });

  await prisma.user.update({
    where: {
      id: admin.id,
    },
    data: {
      passwordHash,
    },
  });

  console.log(`Password reset successfully for admin: ${admin.email}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);

    await prisma.$disconnect();

    process.exit(1);
  });