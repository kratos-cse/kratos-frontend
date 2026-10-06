import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { PAPYRUS_REGISTRATION_URL } from "@/lib/links";
import {
  PAPYRUS_CONTACTS,
  PAPYRUS_DESCRIPTION,
  PAPYRUS_HERO_DATE,
  PAPYRUS_HERO_VENUE,
  PAPYRUS_IMPORTANT_DATES,
  PAPYRUS_PAPER_SUBMISSION_INTRO,
  PAPYRUS_PARTICIPATION_GUIDELINES,
  PAPYRUS_SUBMISSION_REQUIREMENTS,
  PAPYRUS_TAGLINE,
  PAPYRUS_THEMES,
} from "@/data/papyrusContent";
import PapyrusHero from "./components/PapyrusHero";
import ThemesSection from "./components/ThemesSection";
import styles from "./papyrus.module.css";

export default function PapyrusPage() {
  return (
    <div className={styles.papyrusTheme}>
      <PageShell immersive>
        <div className={styles.pageWrapper}>
          <PapyrusHero
            tagline={PAPYRUS_TAGLINE}
            description={PAPYRUS_DESCRIPTION}
            heroDate={PAPYRUS_HERO_DATE}
            heroVenue={PAPYRUS_HERO_VENUE}
          />

          <section id="registration" className={styles.section}>
            <div className={`container ${styles.sectionNarrow}`}>
              <h2 className={styles.sectionTitle}>Registration</h2>
              <h3 className={styles.subsectionTitle}>Participation guidelines</h3>
              <ul className={styles.compactList}>
                {PAPYRUS_PARTICIPATION_GUIDELINES.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className={styles.rulesLinkWrap}>
                <Link href="/papyrus/rules" className={styles.textLink}>
                  Rules and regulation
                </Link>
              </p>
            </div>
          </section>

          <section id="submission-guidelines" className={styles.section}>
            <div className={`container ${styles.sectionNarrow}`}>
              <h2 className={styles.sectionTitle}>Submission guidelines</h2>
              <p className={styles.sectionLead}>
                IEEE format, page limit and submission instructions
              </p>
              <h3 className={styles.subsectionTitle}>Submission requirements</h3>
              <ul className={styles.compactList}>
                {PAPYRUS_SUBMISSION_REQUIREMENTS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section id="paper-submission" className={styles.section}>
            <div className={`container ${styles.sectionNarrow}`}>
              <h2 className={styles.sectionTitle}>Paper submission</h2>
              <p className={styles.sectionLead}>{PAPYRUS_PAPER_SUBMISSION_INTRO}</p>
              <ul className={styles.processList}>
                <li>
                  <strong>PDF upload</strong> — Submit your paper in PDF format (IEEE, max 6 pages).
                </li>
                <li>
                  <strong>Author details</strong> — Provide author names and institution details in the
                  registration form.
                </li>
              </ul>
              <div className={styles.ctaGroup}>
                <Button
                  href={PAPYRUS_REGISTRATION_URL}
                  size="lg"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open registration form (new tab)"
                >
                  Register &amp; submit via form
                </Button>
              </div>
            </div>
          </section>

          <ThemesSection themes={PAPYRUS_THEMES} />

          <section id="dates" className={styles.section}>
            <div className={`container ${styles.sectionNarrow}`}>
              <h2 className={styles.sectionTitle}>Important dates</h2>
              <ol className={styles.datesList}>
                {PAPYRUS_IMPORTANT_DATES.map((row) => (
                  <li key={row.label} className={styles.datesItem}>
                    <div className={styles.datesDate}>{row.date}</div>
                    <div>
                      <div className={styles.datesLabel}>{row.label}</div>
                      <div className={styles.datesDetail}>{row.detail}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section id="contact" className={styles.section}>
            <div className={`container ${styles.sectionNarrow}`}>
              <h2 className={styles.sectionTitle}>Contact</h2>
              <ul className={styles.contactList}>
                {PAPYRUS_CONTACTS.map((person) => (
                  <li key={person.phone} className={styles.contactItem}>
                    <span className={styles.contactName}>
                      {person.name} — {person.detail}
                    </span>
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
