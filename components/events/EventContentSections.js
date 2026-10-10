"use client";

import styles from "./EventContentSections.module.css";

function sectionTitle(section) {
  if (section.title?.trim()) return section.title;
  const type = String(section.section_type || "").replace(/_/g, " ");
  return type.charAt(0) + type.slice(1).toLowerCase();
}

export function EventContentSections({ sections }) {
  const items = (sections || [])
    .filter((s) => s.is_visible !== false)
    .slice()
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  if (!items.length) return null;

  return (
    <div className={styles.wrap}>
      {items.map((section) => (
        <section key={section.id} className={styles.section}>
          <h2 className={styles.title}>{sectionTitle(section)}</h2>
          <div className={styles.body}>{section.content}</div>
        </section>
      ))}
    </div>
  );
}
