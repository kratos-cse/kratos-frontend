import { PageShell } from "@/components/layout/PageShell";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeCategories } from "@/components/home/HomeCategories";
import { HomeOpenNow } from "@/components/home/HomeOpenNow";
import { HomeFinalCta } from "@/components/home/HomeFinalCta";

export default function HomePage() {
  return (
    <PageShell wide>
      <HomeHero />
      <HomeCategories />
      <HomeOpenNow />
      <HomeFinalCta />
    </PageShell>
  );
}
