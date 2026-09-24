import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { GlareHover } from "@/components/effects/GlareHover";
import styles from "@/app/landing.module.css";

/** Static hero — server-rendered for immediate first paint. */
export function HomeHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroVisual}>
        <div aria-hidden>
          <Image
            src="/lion-mark.png"
            alt=""
            width={280}
            height={280}
            className={styles.lion}
            priority
            sizes="(max-width: 900px) 200px, 280px"
          />
        </div>
      </div>
      <div className={styles.heroCopy}>
        <Image
          src="/kratos26.png"
          alt="KRATOS'26"
          width={420}
          height={100}
          className={styles.wordmark}
          priority
          sizes="(max-width: 600px) 280px, 420px"
        />
        <p className={styles.lead}>
          Discover events. Register in minutes. Manage your team and ticket in one place.
        </p>
        <div className={styles.ctas}>
          <GlareHover>
            <Button href="/events" size="lg">
              Explore Events
            </Button>
          </GlareHover>
          <Button href="/registrations" size="lg" variant="secondary">
            My Registrations
          </Button>
        </div>
      </div>
    </section>
  );
}
