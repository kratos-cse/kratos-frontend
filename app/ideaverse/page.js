"use client";

import { useState, useRef, useEffect } from "react";
import { PageShell } from "@/components/layout/PageShell";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";
import { DarkVeil } from "@/components/motion/DarkVeil";
import { DepthCarousel } from "@/components/motion/DepthCarousel";
import styles from "./ideaverse.module.css";

const THEMES = [
  "01 — AI & Generative Intelligence",
  "02 — Machine Learning & Intelligent Systems",
  "03 — Cybersecurity & Digital Trust",
  "04 — Data Science & Big Data Analytics",
  "05 — IoT, Edge & Smart Systems",
  "06 — Cloud & Distributed Computing",
  "07 — Robotics & Autonomous Technologies",
  "08 — Blockchain & Decentralized Technologies",
  "09 — Digital Health & Biomedical Innovation",
  "10 — FinTech & Digital Transformation",
  "11 — Sustainable & Green Technology",
  "12 — Human-Centric & Assistive Technology",
  "13 — Software Engineering & Emerging Applications",
  "14 — Smart Infrastructure & Industry 5.0",
  "15 — Technology for Social Impact"
];

const RULES = [
  "Individual participation is allowed, with a maximum of 2 authors per paper.",
  "UG and PG students from recognized institutions are eligible.",
  "Papers must follow the prescribed IEEE format and must not exceed 6 pages.",
  "Papers must be submitted as PDF files before the deadline.",
  "Late submissions will not be accepted.",
  "Papers should align with the symposium themes; core and interdisciplinary topics are allowed.",
  "Submitted work must be original and free from plagiarism.",
  "Papers with plagiarism above 15% will be disqualified.",
  "Shortlisted participants must present their papers before the judges.",
  "The presentation consists of 8 minutes followed by 2 minutes of Q&A.",
  "The presentation must be in English.",
  "Participants must carry their presentation on a pen drive.",
  "Participants must report 15 minutes before their assigned slot/session.",
  "Participants must carry a valid student ID.",
  "No substantial alteration should be made after shortlisting without informing the organizers.",
  "Participants must follow organizer and judge instructions.",
  "Misconduct, unauthorized collaboration, or misrepresentation may result in disqualification.",
  "The decision of the organizers/judges is final."
];

const DATES = [
  { date: "1 Oct 2026", text: "Paper Submission Opens" },
  { date: "10 Oct 2026", text: "Last Date to Submit Paper" },
  { date: "15 Oct 2026", text: "Acceptance / Shortlisting Notification" },
  { date: "20 Oct 2026", text: "Final Paper Submission" },
  { date: "28 Oct 2026", text: "Paper Conference – Presentation Round" },
  { date: "29 Oct 2026", text: "Final Presentations & Winner Announcement" }
];

// Collapsible Component
function CollapsibleSection({ title, children, isNested = false }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${styles.accordionContainer} ${isNested ? styles.accordionNested : ''}`}>
      <button
        type="button"
        className={styles.accordionToggle}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={styles.accordionTitle}>{title}</span>
        <motion.span 
          animate={{ rotate: isOpen ? 180 : 0 }} 
          className={styles.accordionIcon}
        >
          ▼
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className={styles.accordionContentWrapper}
          >
            <div className={styles.accordionContent}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Accordion Group for Submission Guidelines
function AccordionGroup({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className={styles.accordionGroup}>
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className={styles.nestedAccordionContainer}>
            <button
              type="button"
              className={styles.nestedAccordionToggle}
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              aria-expanded={isOpen}
            >
              <span className={styles.nestedAccordionTitle}>{item.title}</span>
              <motion.span 
                animate={{ rotate: isOpen ? 90 : 0 }} 
                className={styles.accordionIcon}
              >
                ›
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className={styles.accordionContentWrapper}
                >
                  <div className={styles.nestedAccordionContent}>
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// Interactive Timeline
function ScrollTimeline() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div ref={containerRef} className={styles.timeline}>
      <div className={styles.timelineTrack}></div>
      <motion.div 
        className={styles.timelineProgress} 
        style={{ scaleY, transformOrigin: "top" }} 
      />
      
      {DATES.map((item, idx) => (
        <motion.div 
          key={idx}
          className={styles.timelineItem}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.4 }}
        >
          <motion.div 
            className={styles.timelineDot}
            initial={{ backgroundColor: "var(--iv-surface)", borderColor: "var(--iv-border)" }}
            whileInView={{ backgroundColor: "var(--iv-gold)", borderColor: "var(--iv-gold)", boxShadow: "0 0 15px var(--iv-gold-dim)" }}
            viewport={{ once: false, margin: "-30%" }}
            transition={{ duration: 0.2 }}
          />
          <div className={styles.timelineContent}>
            <div className={styles.timelineDate}>{item.date}</div>
            <div className={styles.timelineText}>{item.text}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Flip Card Component
function FlipCard({ title, subtitle, backContent }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const toggle = () => setIsFlipped((prev) => !prev);

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <button
      type="button"
      className={styles.flipCardWrapper}
      onClick={toggle}
      onKeyDown={onKeyDown}
      aria-expanded={isFlipped}
      aria-label={`${title}. ${isFlipped ? "Hide" : "Show"} round details`}
    >
      <motion.div
        className={styles.flipCardInner}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        aria-hidden="true"
      >
        <div className={styles.flipCardFront}>
          <div className={styles.roundEyebrow}>{subtitle}</div>
          <h3 className={styles.roundTitle}>{title}</h3>
          <div className={styles.flipPrompt}>Click to reveal details</div>
        </div>
        <div className={styles.flipCardBack}>
          {backContent}
        </div>
      </motion.div>
    </button>
  );
}

// Responsive Carousel Hook
function useResponsiveCarousel() {
  const [props, setProps] = useState({
    cardWidth: 280,
    cardHeight: 360,
    depth: 170,
    spread: 35,
    tilt: 10,
    perspective: 1400,
    visibleCards: 4,
    falloff: 0.22,
    blur: 5
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w <= 480) {
        setProps({ cardWidth: 190, cardHeight: 255, depth: 65, spread: 45, tilt: 4, perspective: 850, visibleCards: 3, falloff: 0.15, blur: 2 });
      } else if (w <= 768) {
        setProps({ cardWidth: 220, cardHeight: 290, depth: 100, spread: 65, tilt: 7, perspective: 1000, visibleCards: 3, falloff: 0.18, blur: 3 });
      } else {
        setProps({ cardWidth: 280, cardHeight: 360, depth: 170, spread: 90, tilt: 10, perspective: 1400, visibleCards: 4, falloff: 0.22, blur: 5 });
      }
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return props;
}

export default function IdeaversePage() {
  const carouselProps = useResponsiveCarousel();

  const submissionItems = [
    { title: "Paper Format", content: "Prescribed IEEE format." },
    { title: "Maximum Length", content: "Maximum 6 pages." },
    { title: "File Format", content: "PDF." },
    { title: "Domain and Originality", content: "The paper must be original and related to technology/engineering. It should align with the symposium themes. Core and interdisciplinary topics are allowed." },
    { title: "Deadlines and Late Submissions", content: "Submit before the specified deadline. Late submissions will not be accepted." },
    { title: "Plagiarism", content: "Plagiarism above 15% results in disqualification." }
  ];

  return (
    <div className={styles.ideaverseTheme}>
      <PageShell wide>
        <div className={styles.pageWrapper}>
          
          <section className={styles.heroSection}>
            <div className={styles.heroBackground} aria-hidden="true">
              <DarkVeil
                colorStops={['#030816', '#162040', '#0a1128']}
                amplitude={1.2}
                blend={0.6}
                speed={1.0}
                lightMode={false}
              />
            </div>
            
            <div className={styles.heroContent}>
              <motion.h1 
                className={styles.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                IDEAVERSE
              </motion.h1>
              
              <motion.p 
                className={styles.tagline}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                Ideas That Connect. Research That Inspires.
              </motion.p>
              
              <motion.div 
                className={styles.ctaGroup}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href="#submission" className={styles.btnPrimary}>Submission guidelines</Link>
                <Link href="#themes" className={styles.btnSecondary}>Explore Themes</Link>
              </motion.div>
            </div>
          </section>

          {/* Participation & Eligibility (Collapsible) */}
          <Reveal delay={0.1} y={20}>
            <section className={styles.sectionTight}>
              <div className="container" style={{maxWidth: "800px"}}>
                <CollapsibleSection title="Participation & Eligibility">
                  <ul className={styles.compactList}>
                    <li>Individual participation is allowed.</li>
                    <li>Maximum 2 authors per paper.</li>
                    <li>Participants may participate individually or as a team of two.</li>
                    <li>UG and PG students are eligible.</li>
                    <li>Participants must belong to a recognized educational institution.</li>
                    <li><strong style={{color: "var(--iv-gold)"}}>Maximum expected participation: 20 teams/papers.</strong></li>
                    <li>Registration may close once the maximum capacity is reached.</li>
                    <li>The final number of shortlisted papers depends on quality and eligibility.</li>
                  </ul>
                </CollapsibleSection>
              </div>
            </section>
          </Reveal>

          {/* Student Requirements (Collapsible) */}
          <Reveal delay={0.15} y={20}>
            <section className={styles.sectionTight}>
              <div className="container" style={{maxWidth: "800px"}}>
                <CollapsibleSection title="Student Requirements">
                  <ul className={styles.compactList}>
                    <li>Valid student ID required.</li>
                    <li>Basic research methodology/domain knowledge expected.</li>
                    <li>Ability to explain research clearly and answer technical questions.</li>
                    <li>Carry presentation on a pen drive.</li>
                  </ul>
                </CollapsibleSection>
              </div>
            </section>
          </Reveal>

          {/* Conference Themes */}
          <Reveal delay={0.2} y={20}>
            <section id="themes" className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Conference Themes</h2>
              </div>
              <div className={styles.carouselContainer}>
                <DepthCarousel
                  {...carouselProps}
                  radius={18}
                  tiltDirection="right"
                  duration={650}
                  ease="power3.out"
                  autoplay={false}
                  loop={true}
                  showControls={true}
                  showIndicators={true}
                >
                  {THEMES.map((theme, idx) => {
                    const [num, title] = theme.split(" — ");
                    return (
                      <div key={idx} className={styles.carouselCardInner}>
                        <div className={styles.themeNum}>{num}</div>
                        <div className={styles.themeTitle}>{title}</div>
                      </div>
                    );
                  })}
                </DepthCarousel>
              </div>
            </section>
          </Reveal>

          {/* Important Dates */}
          <Reveal delay={0.2} y={20}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Important Dates</h2>
              </div>
              <div className="container" style={{maxWidth: "600px"}}>
                <ScrollTimeline />
              </div>
            </section>
          </Reveal>

          {/* Submission Guidelines (Nested Accordion) */}
          <Reveal delay={0.2} y={20}>
            <section id="submission" className={styles.sectionTight}>
              <div className="container" style={{maxWidth: "800px"}}>
                <CollapsibleSection title="Submission Guidelines">
                  <AccordionGroup items={submissionItems} />
                </CollapsibleSection>
              </div>
            </section>
          </Reveal>

          {/* Research Journey / Two Rounds (Flip Cards) */}
          <Reveal delay={0.2} y={20}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Research Journey</h2>
              </div>
              <div className={`container ${styles.flipContainer}`}>
                <FlipCard 
                  subtitle="ROUND 1"
                  title="Abstract/Paper Submission"
                  backContent={
                    <div className={styles.flipBackContent}>
                      <h4 style={{color: "var(--iv-gold)", marginBottom: "0.5rem"}}>Preliminary research evaluation</h4>
                      <ul style={{textAlign: "left", paddingLeft: "1.2rem"}}>
                        <li>Originality</li>
                        <li>Relevance</li>
                        <li>Technical content</li>
                        <li>Research approach</li>
                        <li>Theme alignment</li>
                      </ul>
                    </div>
                  }
                />
                
                <FlipCard 
                  subtitle="ROUND 2"
                  title="Paper Presentation"
                  backContent={
                    <div className={styles.flipBackContent}>
                      <h4 style={{color: "var(--iv-gold)", marginBottom: "0.5rem"}}>Judges Evaluation</h4>
                      <p style={{marginBottom: "0.5rem"}}>Shortlisted participants present before judges.</p>
                      <ul style={{textAlign: "left", paddingLeft: "1.2rem"}}>
                        <li>Technical understanding</li>
                        <li>Presentation quality</li>
                        <li>Research methodology</li>
                        <li>Contribution</li>
                        <li>Responses during Q&A</li>
                      </ul>
                    </div>
                  }
                />
              </div>
            </section>
          </Reveal>

          {/* Evaluation Frameworks (Collapsible) */}
          <Reveal delay={0.2} y={20}>
            <section className={styles.sectionTight}>
              <div className="container" style={{maxWidth: "800px"}}>
                <CollapsibleSection title="Evaluation Frameworks">
                  <div className={styles.evalGrid}>
                    <div>
                      <h4 style={{color: "var(--iv-gold)", marginBottom: "1rem"}}>Round 1 Evaluation</h4>
                      <ul className={styles.compactList}>
                        <li>Originality & Novelty — <strong>25%</strong></li>
                        <li>Relevance to Symposium Theme — <strong>20%</strong></li>
                        <li>Technical Depth & Methodology — <strong>25%</strong></li>
                        <li>Research Contribution / Impact — <strong>15%</strong></li>
                        <li>Quality of Paper & Presentation of Content — <strong>15%</strong></li>
                      </ul>
                    </div>
                    <div>
                      <h4 style={{color: "var(--iv-gold)", marginBottom: "1rem"}}>Round 2 Evaluation</h4>
                      <ul className={styles.compactList}>
                        <li>Technical Understanding — <strong>25%</strong></li>
                        <li>Clarity & Organization of Presentation — <strong>20%</strong></li>
                        <li>Research Methodology & Results — <strong>20%</strong></li>
                        <li>Innovation / Contribution — <strong>15%</strong></li>
                        <li>Response During Q&A — <strong>15%</strong></li>
                        <li>Time Management & Communication — <strong>5%</strong></li>
                      </ul>
                    </div>
                  </div>
                </CollapsibleSection>
              </div>
            </section>
          </Reveal>

          {/* Rules & Regulations (Collapsible) */}
          <Reveal delay={0.2} y={20}>
            <section className={styles.sectionTight}>
              <div className="container" style={{maxWidth: "800px"}}>
                <CollapsibleSection title="Rules & Regulations">
                  <ol className={styles.numberedList}>
                    {RULES.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ol>
                </CollapsibleSection>
              </div>
            </section>
          </Reveal>

          {/* Recommended Event Duration (Collapsible) */}
          <Reveal delay={0.2} y={20}>
            <section className={styles.sectionTight}>
              <div className="container" style={{maxWidth: "800px"}}>
                <CollapsibleSection title="Recommended Event Duration">
                  <div style={{textAlign: "center", marginBottom: "1.5rem"}}>
                    <span style={{fontSize: "var(--text-2xl)", color: "var(--iv-gold)", fontWeight: 600}}>Approximately 2.5–3 hours</span>
                  </div>
                  <ul className={styles.compactList} style={{maxWidth: "500px", margin: "0 auto"}}>
                    <li><strong>15 min</strong> — Registration, team confirmation & briefing</li>
                    <li><strong>60 min</strong> — Paper Presentation Session 1</li>
                    <li><strong>10 min</strong> — Short break / transition</li>
                    <li><strong>60 min</strong> — Paper Presentation Session 2</li>
                    <li><strong>20 min</strong> — Jury evaluation</li>
                    <li><strong>15 min</strong> — Results preparation</li>
                    <li><strong>20 min</strong> — Closing & winner announcement</li>
                  </ul>
                </CollapsibleSection>
              </div>
            </section>
          </Reveal>

          {/* Final CTA */}
          <Reveal delay={0.2} y={20}>
            <section className={styles.ctaSection}>
              <h2 className={styles.ctaTitle}>Have an Idea Worth Sharing?</h2>
              <p className={styles.ctaDesc}>Submit your research. Present your work. Connect your ideas with the wider research community.</p>
              <div className={styles.ctaGroup}>
                <Link href="#submission" className={styles.btnPrimary}>Submission guidelines</Link>
                <Link href="#themes" className={styles.btnSecondary}>VIEW THEMES</Link>
              </div>
            </section>
          </Reveal>

        </div>
      </PageShell>
    </div>
  );
}
