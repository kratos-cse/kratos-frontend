"use client";

import KratosNav from "@/components/kratos/KratosNav";
import KratosFooter from "@/components/kratos/KratosFooter";
import KratosHero from "@/components/kratos/KratosHero";

export default function Home() {
  return (
    <div className="landing-shell">
      <KratosNav />
      <main>
        <KratosHero />
      </main>
      <KratosFooter />
    </div>
  );
}
