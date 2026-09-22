"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Tabs.module.css";

/**
 * Accessible tabs: arrow keys move focus; Enter/Space activates.
 */
export function Tabs({ items, value, onChange, ariaLabel = "Filters" }) {
  const listRef = useRef(null);
  const [focusIndex, setFocusIndex] = useState(0);

  useEffect(() => {
    const idx = Math.max(
      0,
      items.findIndex((item) => item.value === value)
    );
    setFocusIndex(idx);
  }, [value, items]);

  function activate(nextValue) {
    onChange?.(nextValue);
  }

  function onKeyDown(e) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const count = items.length;
    let next = focusIndex;
    if (e.key === "ArrowRight") next = (focusIndex + 1) % count;
    if (e.key === "ArrowLeft") next = (focusIndex - 1 + count) % count;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = count - 1;
    setFocusIndex(next);
    const btn = listRef.current?.querySelectorAll('[role="tab"]')?.[next];
    btn?.focus();
  }

  return (
    <div
      className={styles.list}
      role="tablist"
      aria-label={ariaLabel}
      ref={listRef}
      onKeyDown={onKeyDown}
    >
      {items.map((item, index) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            id={`tab-${item.value}`}
            aria-selected={selected}
            tabIndex={selected || (value == null && index === focusIndex) ? 0 : -1}
            className={[styles.tab, selected ? styles.active : ""].join(" ")}
            onClick={() => activate(item.value)}
          >
            {item.label}
            {typeof item.count === "number" ? (
              <span className={styles.count}>{item.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
