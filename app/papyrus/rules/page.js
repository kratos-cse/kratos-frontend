import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { PAPYRUS_RULES } from "@/data/papyrusContent";
import styles from "../papyrus.module.css";

export const metadata = {
  title: "Rules and Regulation",
  description:
    "Official rules and regulations for PAPYRUS — participation, paper format, deadlines, presentation, and conduct.",
  alternates: { canonical: "/papyrus/rules" },
  openGraph: {
    url: "/papyrus/rules",
    title: "Rules and Regulation · PAPYRUS",
  },
};

export default function PapyrusRulesPage() {
  return (
    <div className={styles.papyrusTheme}>
      <PageShell>
        <div className={styles.pageWrapper}>
          <article className={`container ${styles.rulesPage}`}>
            <p className={styles.rulesBack}>
              <Link href="/papyrus" className={styles.textLink}>
                ← Back to PAPYRUS
              </Link>
            </p>
            <h1 className={styles.rulesPageTitle}>Rules and regulation</h1>
            <ol className={styles.rulesPageList}>
              {PAPYRUS_RULES.map((rule, index) => (
                <li key={rule.title} className={styles.rulesPageItem}>
                  <h2 className={styles.rulesPageRuleTitle}>
                    {index + 1}. {rule.title}
                  </h2>
                  <p>{rule.body}</p>
                </li>
              ))}
            </ol>
          </article>
        </div>
      </PageShell>
    </div>
  );
}
