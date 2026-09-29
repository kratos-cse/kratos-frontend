"use client";

import styles from "./EventCoordinators.module.css";

function contactHref(contact) {
  const c = String(contact || "").trim();
  if (!c) return null;
  if (c.includes("@")) return `mailto:${c}`;
  const digits = c.replace(/[^\d+]/g, "");
  if (digits.length >= 8) return `tel:${digits}`;
  return null;
}

export function EventCoordinators({ coordinators = [] }) {
  if (!coordinators.length) return null;

  return (
    <section className={styles.block}>
      <h2 className={styles.h2}>Contact</h2>
      <ul className={styles.list}>
        {coordinators.map((c) => {
          const href = contactHref(c.contact);
          return (
            <li key={c.id} className={styles.card}>
              <div className={styles.name}>{c.name}</div>
              {c.role ? <div className={styles.role}>{c.role}</div> : null}
              {href ? (
                <a className={styles.contact} href={href}>{c.contact}</a>
              ) : (
                <div className={styles.contact}>{c.contact}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
