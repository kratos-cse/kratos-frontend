"use client";

import styles from "./EventContentSections.module.css";

const TYPE_LABELS = {
  REQUIREMENTS: "Requirements",
  RULES: "Rules",
  ELIGIBILITY: "Eligibility",
  PRIZES: "Prizes",
  INSTRUCTIONS: "Instructions",
  WHAT_TO_BRING: "What to bring",
  FORMAT: "Format",
  JUDGING_CRITERIA: "Judging criteria",
  CUSTOM: null,
};

export function EventContentSections({ sections = [] }) {
  const visible = sections.filter((s) => s.is_visible && (s.title || s.content));
  if (!visible.length) return null;

  return (
    <div className={styles.wrap}>
      {visible.map((section) => {
        const typeLabel = TYPE_LABELS[section.section_type];
        const heading = section.title || typeLabel || "Details";
        return (
          <section key={section.id} className={styles.block}>
            <h2 className={styles.h2}>{heading}</h2>
            {section.content ? <p className={styles.body}>{section.content}</p> : null}
          </section>
        );
      })}
    </div>
  );
}
