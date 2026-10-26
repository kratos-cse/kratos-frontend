import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { PAPYRUS_REGISTRATION_URL } from "@/lib/links";
import {
  PAPYRUS_CONTACTS,
  PAPYRUS_DESCRIPTION,
  PAPYRUS_ELIGIBILITY,
  PAPYRUS_EVENT_NAME,
  PAPYRUS_EVENT_SCHEDULE,
  PAPYRUS_HERO_DATE,
  PAPYRUS_HERO_TIME,
  PAPYRUS_HERO_VENUE,
  PAPYRUS_PARTICIPANT_COMMUNICATION,
  PAPYRUS_PARTICIPATION,
  PAPYRUS_SUBMISSION_FORMAT_NOTE,
  PAPYRUS_SUBMISSION_REQUIREMENTS,
  PAPYRUS_TAGLINE_LINES,
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
              <h2 className={styles.sectionTitle}>{PAPYRUS_EVENT_NAME}</h2>
              <p className={styles.aboutBody}>{PAPYRUS_DESCRIPTION}</p>
            </div>
          </section>

          <section id="registration" className={`${styles.screenSection} ${styles.screenRegistration}`}>
            <div className={styles.screenInner}>
              <p className={styles.eyebrow}>Registration</p>
              <h2 className={styles.sectionTitle}>Eligibility</h2>
              <p className={styles.sectionLead}>{PAPYRUS_ELIGIBILITY}</p>
              <h3 className={styles.panelTitle}>Participation</h3>
              <p className={styles.sectionLead}>{PAPYRUS_PARTICIPATION}</p>
              <p className={styles.sectionLead}>{PAPYRUS_PARTICIPANT_COMMUNICATION}</p>
              <div className={styles.regPanelFooter}>
                <Link href="/papyrus/rules" className={styles.rulesLink}>
                  Rules and regulation →
                </Link>
              </div>
            </div>
          </section>

          <section
            id="submission-guidelines"
            className={`${styles.screenSection} ${styles.screenSubmission}`}
          >
            <div className={styles.screenInner}>
              <p className={styles.eyebrow}>Submission</p>
              <h2 className={styles.sectionTitle}>Submission requirements</h2>
              <p className={styles.submissionIntro}>{PAPYRUS_SUBMISSION_FORMAT_NOTE}</p>
              <dl className={styles.specGrid}>
                {PAPYRUS_SUBMISSION_REQUIREMENTS.map((row) => (
                  <div key={row.label} className={styles.specRow}>
                    <dt>{row.label}</dt>
                    <dd>{row.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section id="dates" className={`${styles.screenSection} ${styles.screenDates}`}>
            <div className={styles.screenInner}>
              <p className={styles.eyebrow}>Schedule</p>
              <h2 className={styles.sectionTitle}>Event schedule</h2>
              <dl className={styles.specGrid}>
                <div className={styles.specRow}>
                  <dt>Date</dt>
                  <dd>{PAPYRUS_EVENT_SCHEDULE.date}</dd>
                </div>
                <div className={styles.specRow}>
                  <dt>Time</dt>
                  <dd>{PAPYRUS_EVENT_SCHEDULE.time}</dd>
                </div>
                <div className={styles.specRow}>
                  <dt>Venue</dt>
                  <dd>{PAPYRUS_EVENT_SCHEDULE.venue}</dd>
                </div>
              </dl>
            </div>
          </section>

          <section id="cta" className={`${styles.screenSection} ${styles.screenCta}`}>
            <div className={styles.screenInner}>
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
              <p className={styles.eyebrow}>Contact</p>
              <h2 className={styles.sectionTitle}>Event coordinators</h2>
              <ul className={styles.contactList}>
                {PAPYRUS_CONTACTS.map((person) => (
                  <li key={person.phone} className={styles.contactCard}>
                    <span className={styles.contactName}>{person.name}</span>
                    <a href={`tel:${person.phone}`} className={styles.contactPhone}>
                      {person.phone}
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
