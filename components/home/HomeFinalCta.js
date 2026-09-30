import Image from "next/image";
import { Button } from "@/components/ui/Button";
import styles from "@/app/landing.module.css";

export function HomeFinalCta() {
  return (
    <section style={{ padding: "64px 0" }}>
      <div className="container">
        <h2 className="section-title" style={{ margin: 0, fontSize: "2.5rem", fontWeight: 700 }}>Ready to compete?</h2>
        <p className="muted" style={{ margin: "16px 0 32px", color: "var(--text-secondary)" }}>Browse the full catalogue and register when you’re ready.</p>
        <div style={{ display: "flex", gap: "16px" }}>
          <Button href="/events" size="lg">
            Explore Events
          </Button>
          <Button href="/login?next=%2Fevents" size="lg" variant="secondary">
            Sign in
          </Button>
        </div>
      </div>
    </section>
  );
}
