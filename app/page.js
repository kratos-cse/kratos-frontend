import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { OrbitHero } from "@/components/landing/OrbitHero";
import { LionJourney } from "@/components/landing/LionJourney";
import { MainHero } from "@/components/landing/MainHero";
import { HomeFinalCta } from "@/components/home/HomeFinalCta";
import styles from "./landing.module.css";

const ARENAS = [
  {
    key: "technical",
    icon: "/landing/technical.png",
    num: "01",
    verb: "Build",
    title: "Technical",
    tag: "Engineer the impossible.",
    desc: "Precision challenges for builders, coders, and systems thinkers.",
    href: "/events?category=TECHNICAL",
  },
  {
    key: "title",
    icon: "/landing/spark-stage.png",
    num: "02",
    verb: "Perform",
    title: "Title Event",
    tag: "The stage is yours.",
    desc: "The fest's flagship showcases, where the spotlight finds its champions.",
    href: "/events?category=TITLE_EVENT",
  },
  {
    key: "online",
    icon: "/landing/online-console.png",
    num: "03",
    verb: "Connect",
    title: "Online",
    tag: "Compete beyond walls.",
    desc: "Remote arenas that bring every campus onto one signal.",
    href: "/events?category=ONLINE",
  },
  {
    key: "spark",
    icon: "/landing/playground.png",
    num: "04",
    verb: "Create",
    title: "Spark",
    tag: "Ideas that ignite.",
    desc: "Creative spark events where ideas take the spotlight.",
    href: "/events?category=SPARK",
  },
  {
    key: "projectexpo",
    icon: "/landing/technical.png",
    num: "05",
    verb: "Showcase",
    title: "Project Expo",
    tag: "Build. Demo. Inspire.",
    desc: "Engineering projects and prototypes on the fest exhibition floor.",
    href: "/events?category=PROJECT_EXPO",
  },
];

export default function HomePage() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <LionJourney>
          <MainHero />
          <OrbitHero arenas={ARENAS} />
        </LionJourney>
        <HomeFinalCta />
      </main>
      <Footer />
    </div>
  );
}
