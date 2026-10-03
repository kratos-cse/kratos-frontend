import Image from "next/image";
import { Button } from "@/components/ui/Button";
import styles from "@/app/landing.module.css";

export function HomeFinalCta() {
  return (
    <section className={styles.finalCta}>
      <h2 className="section-title">Ready to compete?</h2>
      <p className="muted">Browse the full catalogue and register when you’re ready.</p>
      <div className={styles.ctas}>
        <Button href="/events" size="lg">
          Explore Events
        </Button>
        <Button href="/login?next=%2Fevents" size="lg" variant="secondary">
          Sign in
        </Button>
      </div>
      <div className={styles.instRow} aria-label="Presented by">
        <Image
          src="/eec-white.png"
          alt="Easwari Engineering College"
          width={200}
          height={48}
          loading="lazy"
        />
        <Image src="/ACE-white.png" alt="ACE" width={72} height={72} loading="lazy" />
      </div>
    </section>
  );
}
