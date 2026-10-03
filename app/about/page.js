import { PageShell } from "@/components/layout/PageShell";
import { Reveal } from "@/components/motion/Reveal";
import DriftWallResponsive from "@/components/effects/DriftWallResponsive";
import styles from "./about.module.css";

export const metadata = {
  title: "About",
  description:
    "KRATOS is the National Level Technical Symposium of the Department of Computer Science and Engineering, Easwari Engineering College, Chennai.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about", title: "About · KRATOS'26" },
};

const WALL_ITEMS = [
  { image: "/about/g-01.jpg", title: "Sports event winning team with trophy" },
  { image: "/about/g-02.jpg", title: "Student presenting a technical paper on stage" },
  { image: "/about/g-03.jpg", title: "Students working in the campus library" },
  { image: "/about/g-04.jpg", title: "Packed auditorium during a symposium session" },
  { image: "/about/g-05.jpg", title: "Team posing with a runners-up trophy" },
  { image: "/about/g-06.jpg", title: "Dignitary at the KRATOS inauguration stage" },
  { image: "/about/g-07.jpg", title: "Mr. Kratos 2024 title award moment" },
  { image: "/about/g-08.jpg", title: "Team demonstrating a drone project" },
  { image: "/about/g-09.jpg", title: "Creative stall signage from a spark event" },
  { image: "/about/g-10.jpg", title: "Participants collaborating on laptops" },
  { image: "/about/g-11.jpg", title: "Mentors reviewing a team's project build" },
];

const STATS = [
  { value: "15+", label: "Years of Legacy" },
  { value: "50+", label: "Events" },
  { value: "2000+", label: "Participants" },
  { value: "100+", label: "Colleges" },
];

const CARDS = [
  {
    icon: "⚡",
    title: "Innovation First",
    body: "We create a space where students push boundaries, prototype bold ideas, and learn from every iteration — whether they win or not.",
  },
  {
    icon: "🤝",
    title: "Community & Collaboration",
    body: "KRATOS connects minds from over 100 colleges across India, building a network that outlasts the symposium itself.",
  },
  {
    icon: "🏆",
    title: "Excellence in Every Event",
    body: "From competitive hackathons to creative spark events, every challenge is designed to stretch skills and reward genuine mastery.",
  },
];

export default function AboutPage() {
  return (
    <PageShell wide>

      {/* ════════════════════════════════
          HERO — DriftWall + text overlay
          ════════════════════════════════ */}
      <section className={styles.hero} aria-labelledby="about-heading">

        <div className={styles.wallWrap} aria-hidden="true">
          <DriftWallResponsive
            items={WALL_ITEMS}
            tileWidth={190}
            tileHeight={126}
            gap={16}
            tilt={18}
            turn={-12}
            perspective={1100}
            depth={100}
            speed={36}
            direction="up"
            variance={0.5}
            parallax={0.5}
            lift={60}
            fade={0.25}
            dim={1}
            grayscale={false}
            overlayColor="rgba(0,0,0,0)"
          />
        </div>

        <div className={styles.scrim} aria-hidden="true" />

        <div className={styles.heroContent}>
          <Reveal y={12}>
            <span className={styles.eyebrow}>
              Department of Computer Science and Engineering
            </span>
          </Reveal>

          <Reveal delay={0.06} y={20}>
            <div>
              <h1 id="about-heading" className={styles.title}>
                ABOUT <span className={styles.titleAccent}>KRATOS</span>
              </h1>
              <span className={styles.titleRule} aria-hidden="true" />
              {/* Extra two lines shown only on mobile, below the heading */}
              <p className={styles.mobileSub}>
                National Level Technical Symposium
              </p>
              <p className={styles.mobileSub}>
                Easwari Engineering College, Chennai
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1} y={14}>
            <div className={styles.copy}>
              <p>
                KRATOS is the National Level Technical Symposium of the Department
                of Computer Science and Engineering, Easwari Engineering College,
                Chennai.
              </p>
              <p>
                With a 15+ year legacy, KRATOS has evolved into a dynamic platform
                that brings together students, innovators, and technology enthusiasts
                to compete, collaborate, create, and showcase their skills.
              </p>
              <p>
                Through a diverse range of technical and spark events, KRATOS
                celebrates innovation, creativity, problem-solving, and teamwork,
                giving participants an opportunity to explore emerging technologies
                and challenge themselves beyond the classroom.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.14} y={10}>
            <p className={styles.roar}>
              KRATOS&nbsp;&rsquo;26
              <span className={styles.roarDash}>&mdash;</span>
              READY TO ROAR
            </p>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          STATS — glassy pill strip
          ════════════════════════════════ */}
      <Reveal delay={0.04}>
        <section className={styles.statsSection} aria-label="Key numbers">
          <ul className={styles.statsInner} role="list">
            {STATS.map((s) => (
              <li key={s.label} className={styles.statItem}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      {/* ════════════════════════════════
          CARDS — mission / vision
          ════════════════════════════════ */}
      <Reveal delay={0.06}>
        <section className={styles.cardsSection} aria-label="Mission and vision">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>What drives us</h2>
            <p className={styles.sectionLead}>
              The principles that have shaped KRATOS for over a decade.
            </p>
          </div>

          <div className={styles.cards}>
            {CARDS.map(({ icon, title, body }) => (
              <article key={title} className={styles.card}>
                <div className={styles.cardIconWrap} aria-hidden="true">
                  {icon}
                </div>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardBody}>{body}</p>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

    </PageShell>
  );
}
