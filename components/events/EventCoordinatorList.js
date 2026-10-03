"use client";

import styles from "./EventCoordinatorList.module.css";

export function EventCoordinatorList({ coordinators }) {
  const items = (coordinators || [])
    .slice()
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  if (!items.length) return null;

  return (
    <section className={styles.wrap}>
      <h2 className={styles.title}>Coordinators</h2>
      <ul className={styles.list}>
        {items.map((c) => (
          <li key={c.id} className={styles.item}>
            <strong>{c.name}</strong>
            {c.role ? <span className={styles.role}>{c.role}</span> : null}
            {c.contact ? <span className={styles.contact}>{c.contact}</span> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
