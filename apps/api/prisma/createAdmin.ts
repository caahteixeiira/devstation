import "dotenv/config";
import * as argon2 from "argon2";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const connectionString = process.env.DIRECT_DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined.");
}

const adapter = new PrismaPg({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const adminName = process.env.ADMIN_NAME?.trim();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminName || !adminEmail || !adminPassword) {
    throw new Error(
      "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required.",
    );
  }

  if (/\s/.test(adminPassword)) {
    throw new Error("ADMIN_PASSWORD must not contain whitespace.");
  }

  if (adminPassword.length < 12) {
    throw new Error("ADMIN_PASSWORD must have at least 12 characters.");
  }

  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: adminEmail,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  if (existingAdmin) {
    console.log(`Admin already exists: ${existingAdmin.email}`);
    return;
  }

  const passwordHash = await argon2.hash(adminPassword, {
    type: argon2.argon2id,
  });

  const admin = await prisma.user.create({
    data: {
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  console.log("Production admin created successfully:");
  console.log(admin);
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