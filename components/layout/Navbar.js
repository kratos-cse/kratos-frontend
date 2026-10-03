"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/Button";
import styles from "./Navbar.module.css";

const LINKS = [
  { href: "/events", label: "Events" },
  { href: "/registrations", label: "My Registrations", auth: true },
  { href: "/profile", label: "Profile", auth: true },
];

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, loading, user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const firstLinkRef = useRef(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Focus first nav item for keyboard users (no enter animation delay)
    requestAnimationFrame(() => firstLinkRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const visibleLinks = LINKS.filter((link) => !link.auth || isAuthenticated);

  return (
    <header className={styles.header}>
      <div className={`container--wide ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label="KRATOS'26 home">
          <Image
            src="/lion-mark.png"
            alt=""
            width={40}
            height={40}
            className={styles.mark}
            priority
          />
          <Image
            src="/kratos26.png"
            alt="KRATOS'26"
            width={140}
            height={36}
            className={styles.wordmark}
            priority
          />
        </Link>

        <nav className={styles.desktop} aria-label="Primary">
          {visibleLinks.map((link) => {
            const active = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={[styles.link, active ? styles.active : ""].join(" ")}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          {!loading && isAuthenticated ? (
            <>
              <span className={styles.userMeta} title={user?.email || ""}>
                {user?.email?.split("@")[0] || "Account"}
              </span>
              <Button variant="ghost" size="sm" type="button" onClick={() => signOut()}>
                Log out
              </Button>
            </>
          ) : !loading ? (
            <Button href={`/login?next=${encodeURIComponent(pathname || "/")}`} size="sm">
              Sign in
            </Button>
          ) : (
            <span className={styles.userMeta} aria-hidden>
              …
            </span>
          )}

          <button
            type="button"
            className={styles.menuBtn}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden className={styles.menuIcon}>
              {open ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {/* Keep mounted so open/close can interpolate (no display:none / hidden) */}
      <div
        id={panelId}
        className={[styles.mobile, open ? styles.mobileOpen : ""].join(" ")}
        aria-hidden={!open}
      >
        <nav className={styles.mobileNav} aria-label="Mobile">
          {visibleLinks.map((link, i) => {
            const active = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                ref={i === 0 ? firstLinkRef : undefined}
                href={link.href}
                tabIndex={open ? 0 : -1}
                className={[styles.mobileLink, active ? styles.active : ""].join(" ")}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href="/events" className={styles.mobileCta} tabIndex={open ? 0 : -1}>
            Explore Events
          </Link>
          {!loading && !isAuthenticated ? (
            <Link
              href={`/login?next=${encodeURIComponent(pathname || "/")}`}
              className={styles.mobileLink}
              tabIndex={open ? 0 : -1}
            >
              Sign in
            </Link>
          ) : null}
          {!loading && isAuthenticated ? (
            <button
              type="button"
              className={styles.mobileLink}
              tabIndex={open ? 0 : -1}
              onClick={() => signOut()}
            >
              Log out
            </button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
