import Image from "next/image";
import Link from "next/link";
import { EVENT_CATEGORIES, CATEGORY_LABELS } from "@/lib/events/categories";
import styles from "./Footer.module.css";

const EXPLORE = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
];

const ARENAS = EVENT_CATEGORIES.map((key) => ({
  href: `/events?category=${key}`,
  label: CATEGORY_LABELS[key],
}));

const ACCOUNT = [
  { href: "/registrations", label: "My Registrations" },
  { href: "/profile", label: "Profile" },
  { href: "/login", label: "Sign in" },
];

function LinkGroup({ title, links }) {
  return (
    <nav className={styles.group} aria-label={title}>
      <h2 className={styles.heading}>{title}</h2>
      <ul className={styles.list}>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={styles.link}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Image
        src="/lion-mark.png"
        alt=""
        aria-hidden
        width={420}
        height={420}
        className={styles.watermark}
      />

      <div className={`container--wide ${styles.inner}`}>
        <div className={styles.top}>
          <div className={styles.brandBlock}>
            <Link href="/" className={styles.brand} aria-label="KRATOS'26 home">
              <Image src="/lion-mark.png" alt="" width={44} height={44} className={styles.mark} />
              <Image src="/kratos26.png" alt="KRATOS'26" width={160} height={40} className={styles.wordmark} />
            </Link>
            <p className={styles.tag}>
              The college fest of the Association of Computer Engineers, Department of Computer
              Science and Engineering, Easwari Engineering College.
            </p>
            <Link href="/events" className={styles.cta}>
              Explore events
              <span aria-hidden className={styles.ctaArrow}>
                →
              </span>
            </Link>
          </div>

          <LinkGroup title="Explore" links={EXPLORE} />
          <LinkGroup title="Arenas" links={ARENAS} />
          <LinkGroup title="Account" links={ACCOUNT} />
        </div>

        <div className={styles.organisers}>
          <span className={styles.organisersLabel}>Organised by</span>
          <div className={styles.logos}>
            <Image
              src="/eec-white.png"
              alt="Easwari Engineering College"
              width={220}
              height={56}
              className={styles.inst}
            />
            <Image
              src="/ACE-white.png"
              alt="Association of Computer Engineers"
              width={96}
              height={96}
              className={styles.ace}
            />
            <Image
              src="/CSE-logo black.png"
              alt="Department of Computer Science and Engineering"
              width={72}
              height={72}
              className={styles.cse}
            />
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.legal}>&copy; 2026 KRATOS&rsquo;26 &middot; Easwari Engineering College</p>
          <a href="#top" className={styles.toTop}>
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
