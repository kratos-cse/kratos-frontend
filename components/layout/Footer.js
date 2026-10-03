import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brandBlock}>
          <Image src="/kratos26.png" alt="KRATOS'26" width={160} height={40} className={styles.wordmark} />
          <p className={styles.tag}>
            College fest platform — discover events, register, and manage your team.
          </p>
        </div>

        <div className={styles.links}>
          <Link href="/events">Events</Link>
          <Link href="/registrations">My Registrations</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/login">Sign in</Link>
        </div>

        <div className={styles.institutions} aria-label="Organizing institutions">
          <Image src="/eec-white.png" alt="Easwari Engineering College" width={220} height={56} className={styles.inst} />
          <Image src="/ACE-white.png" alt="Association of Computer Engineers" width={96} height={96} className={styles.ace} />
          <Image
            src="/CSE-logo black.png"
            alt="Department of Computer Science and Engineering"
            width={72}
            height={72}
            className={styles.cse}
          />
        </div>
      </div>
    </footer>
  );
}
