import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const typescript = await prisma.technology.upsert({
    where: {
      name: "TypeScript",
    },
    update: {},
    create: {
      name: "TypeScript",
      category: "Language",
    },
  });

  const react = await prisma.technology.upsert({
    where: {
      name: "React",
    },
    update: {},
    create: {
      name: "React",
      category: "Frontend",
    },
  });

  const next = await prisma.technology.upsert({
    where: {
      name: "Next.js",
    },
    update: {},
    create: {
      name: "Next.js",
      category: "Framework",
    },
  });

  await prisma.project.upsert({
    where: {
      slug: "devstation",
    },
    update: {},
    create: {
      title: "DevStation",
      slug: "devstation",
      summary:
        "Um ecossistema de portfólio criado para demonstrar projetos, decisões técnicas, estudos e evolução profissional.",
      problem:
        "Portfólios tradicionais mostram apenas resultados finais e pouco sobre o processo de engenharia por trás das decisões.",
      solution:
        "Criar uma plataforma que apresente projetos, artigos, experimentos, arquitetura e decisões técnicas de forma integrada.",
      architecture:
        "Monorepo com aplicação web em Next.js, API em Fastify e persistência em PostgreSQL com Prisma.",
      status: "IN_DEVELOPMENT",
      technologies: {
        connect: [
          { id: typescript.id },
          { id: react.id },
          { id: next.id },
        ],
      },
    },
  });
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