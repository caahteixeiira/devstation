import "dotenv/config";

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

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

export const prisma = new PrismaClient({
  adapter,
});