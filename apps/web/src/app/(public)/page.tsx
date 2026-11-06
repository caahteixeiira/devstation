import { connection } from "next/server";
import { Suspense } from "react";
import { HomeAbout } from "@/app/features/home/HomeAbout";
import { HomeContact } from "@/app/features/home/HomeContact";
import { HomeExplore } from "@/app/features/home/HomeExplore";
import { HomeHero } from "@/app/features/home/HomeHero";
import { HowIWork } from "@/app/features/home/HowIWork";
import { RecentArticles } from "@/app/features/home/RecentArticles";

export default async function Home() {
  // Garante renderização em tempo de requisição: nada é buscado no build.
  await connection();

  return (
    <div className="flex flex-1 flex-col">
      <HomeHero />
      <HowIWork />
      <HomeExplore />

      {/* Faixa inteira some quando não há artigos; sem skeleton para não reservar espaço. */}
      <Suspense fallback={null}>
        <RecentArticles />
      </Suspense>

      <HomeAbout />
      <HomeContact />
    </div>
  );
}
