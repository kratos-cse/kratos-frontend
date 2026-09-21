import React from "react";
import FlowingMenu, { FlowingMenuItem } from "@/components/FlowingMenu";
import Link from "next/link";
import styles from "./events.module.css";

const categoryItems: FlowingMenuItem[] = [
  {
    text: "Spark Events",
    link: "#spark",
    image: "/assets/categories/spark.svg",
  },
  {
    text: "Technical Events",
    link: "#technical",
    image: "/assets/categories/technical.svg",
  },
  {
    text: "Online Events",
    link: "#online",
    image: "/assets/categories/online.svg",
  },
  {
    text: "Sports Events",
    link: "#sports",
    image: "/assets/categories/sports.svg",
  },
  {
    text: "Hackathon",
    link: "#hackathon",
    image: "/assets/categories/hackathon.svg",
  },
  {
    text: "Workshop",
    link: "#workshop",
    image: "/assets/categories/workshop.svg",
  },
];

export default function EventsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.topNav}>
          <Link href="/" className={styles.backLink}>
            ← BACK TO SYSTEM
          </Link>
          <span className={styles.badge}>KRATOS &apos;26 CATEGORIES</span>
        </div>
        <h1 className={styles.title}>EVENT CATEGORIES</h1>
        <p className={styles.subtitle}>HOVER TO EXPLORE THE SYMPOSIUM MATRIX</p>
      </header>

      <main className={styles.menuContainer}>
        <FlowingMenu
          items={categoryItems}
          speed={14}
          textColor="#efe9de"
          bgColor="rgba(15, 3, 5, 0.4)"
          marqueeBgColor="#8c1119"
          marqueeTextColor="#ffffff"
          borderColor="rgba(255, 70, 50, 0.18)"
        />
      </main>

      <footer className={styles.footer}>
        <span>DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING · EEC</span>
      </footer>
    </div>
  );
}
