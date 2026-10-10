import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { PAPYRUS_REGISTRATION_URL } from "@/lib/links";
import {
  PAPYRUS_CONTACTS,
  PAPYRUS_DESCRIPTION,
  PAPYRUS_HERO_DATE,
  PAPYRUS_HERO_TIME,
  PAPYRUS_HERO_VENUE,
  PAPYRUS_PAPER_SUBMISSION_CARDS,
  PAPYRUS_PAPER_SUBMISSION_INTRO,
  PAPYRUS_PARTICIPATION_GUIDELINES,
  PAPYRUS_SUBMISSION_SPECS,
  PAPYRUS_TAGLINE_LINES,
  PAPYRUS_THEMES,
  PAPYRUS_TIMELINE_DATES,
} from "@/data/papyrusContent";
import PapyrusHero from "./components/PapyrusHero";
import styles from "./papyrus.module.css";

export default function PapyrusPage() {
  return (
    <div className={styles.papyrusTheme}>
      <PageShell immersive>
        <div className={styles.pageWrapper}>
          <PapyrusHero
            taglineLines={PAPYRUS_TAGLINE_LINES}
            heroDate={PAPYRUS_HERO_DATE}
            heroTime={PAPYRUS_HERO_TIME}
            heroVenue={PAPYRUS_HERO_VENUE}
          />

          <section id="about" className={`${styles.screenSection} ${styles.screenAbout}`}>
            <div className={styles.screenInner}>
              <p className={styles.eyebrow}>About</p>
              <h2 className={styles.sectionTitle}>About PAPYRUS</h2>
              <div className={styles.aboutTagline}>
                {PAPYRUS_TAGLINE_LINES.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
              <p className={styles.aboutBody}>{PAPYRUS_DESCRIPTION}</p>
            </div>
          </section>

          <section id="themes" className={`${styles.screenSection} ${styles.screenThemes}`}>
            <div className={styles.screenInner}>
              <p className={styles.eyebrow}>Explore</p>
              <h2 className={styles.sectionTitle}>Themes</h2>
              <ul className={styles.themesGrid}>
                {PAPYRUS_THEMES.map((title, index) => (
                  <li key={title} className={styles.themeCard}>
                    <span className={styles.themeNum}>{String(index + 1).padStart(2, "0")}</span>
                    <span className={styles.themeTitle}>{title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section id="registration" className={`${styles.screenSection} ${styles.screenRegistration}`}>
            <div className={styles.screenInner}>
              <p className={styles.eyebrow}>Participate</p>
              <h2 className={styles.sectionTitle}>Registration</h2>
              <p className={styles.sectionLead}>Participation guidelines</p>
              <div className={styles.regPanel}>
                <ul className={styles.regList}>
                  {PAPYRUS_PARTICIPATION_GUIDELINES.map((item) => (
                    <li key={item.num} className={styles.regItem}>
                      <span className={styles.regNum}>{item.num}</span>
                      <span className={styles.regText}>{item.text}</span>
                    </li>
                  ))}
                </ul>
                <div className={styles.regPanelFooter}>
                  <Link href="/papyrus/rules" className={styles.rulesLink}>
                    Rules and regulation →
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section
            id="submission-guidelines"
            className={`${styles.screenSection} ${styles.screenSubmission}`}
          >
            <div className={styles.screenInner}>
              <p className={styles.eyebrow}>Submit</p>
              <h2 className={styles.sectionTitle}>Submission guidelines</h2>
              <p className={styles.sectionLead}>
                IEEE format, page limit and submission instructions
              </p>

              <h3 className={styles.panelTitle}>Submission requirements</h3>
              <dl className={styles.specGrid}>
                {PAPYRUS_SUBMISSION_SPECS.map((row) => (
                  <div key={row.key} className={styles.specRow}>
                    <dt>{row.key}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>

              <h3 className={styles.panelTitle}>Paper submission</h3>
              <p className={styles.submissionIntro}>{PAPYRUS_PAPER_SUBMISSION_INTRO}</p>
              <div className={styles.submissionCards}>
                {PAPYRUS_PAPER_SUBMISSION_CARDS.map((card) => (
                  <div key={card.title} className={styles.submissionCard}>
                    <h4>{card.title}</h4>
                    <p>{card.body}</p>
                  </div>
                ))}
              </div>
              <p className={styles.formNote}>Submit through the official registration form.</p>
            </div>
          </section>

          <section id="dates" className={`${styles.screenSection} ${styles.screenDates}`}>
            <div className={styles.screenInner}>
              <p className={styles.eyebrow}>Plan</p>
              <h2 className={styles.sectionTitle}>Important dates</h2>
              <ol className={styles.timeline}>
                {PAPYRUS_TIMELINE_DATES.map((item, index) => (
                  <li key={item.date + item.label} className={styles.timelineItem}>
                    <div className={styles.timelineMarker} aria-hidden="true">
                      {index < PAPYRUS_TIMELINE_DATES.length - 1 ? (
                        <span className={styles.timelineLine} />
                      ) : null}
                    </div>
                    <div className={styles.timelineContent}>
                      <time className={styles.timelineDate}>{item.date}</time>
                      <p className={styles.timelineLabel}>{item.label}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section id="cta" className={`${styles.screenSection} ${styles.screenCta}`}>
            <div className={styles.screenInner}>
              <h2 className={styles.ctaTitle}>Ready to present your idea?</h2>
              <p className={styles.ctaLead}>
                Submit your research paper and be part of PAPYRUS.
              </p>
              <Button
                href={PAPYRUS_REGISTRATION_URL}
                size="lg"
                className={styles.ctaButton}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Register now (opens Google Form in a new tab)"
              >
                Register Now
              </Button>
            </div>
          </section>

          <section id="contact" className={`${styles.screenSection} ${styles.screenContact}`}>
            <div className={styles.screenInner}>
              <p className={styles.eyebrow}>Reach us</p>
              <h2 className={styles.sectionTitle}>Contact</h2>
              <p className={styles.sectionLead}>For queries and coordination</p>
              <ul className={styles.contactList}>
                {PAPYRUS_CONTACTS.map((person) => (
                  <li key={person.phone} className={styles.contactCard}>
                    <span className={styles.contactName}>{person.name}</span>
                    <span className={styles.contactDetail}>{person.detail}</span>
                    <a href={`tel:${person.phone}`} className={styles.contactPhone}>
                      {person.display}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </PageShell>
    </div>
  );
}
