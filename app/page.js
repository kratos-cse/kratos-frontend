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
    key: "playground",
    icon: "/landing/playground.png",
    num: "04",
    verb: "Play",
    title: "Playground",
    tag: "Where legends play.",
    desc: "Turf, courts, and arenas for the fest's sporting rivalries.",
    href: "/events?category=PLAYGROUND",
  },
  {
    key: "spark",
    icon: "/landing/hackathon.png",
    num: "05",
    verb: "Create",
    title: "Spark",
    tag: "Ideas that ignite.",
    desc: "Open arenas for design, storytelling, and original thinking.",
    href: "/events?category=SPARK",
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
