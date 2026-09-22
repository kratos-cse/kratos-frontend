"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthProvider";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/technical", label: "Technical" },
  { href: "/spark", label: "Spark" },
  { href: "/playground", label: "Playground" },
  { href: "/online", label: "Online" },
  { href: "https://unstop.com", label: "Hackathon ↗", external: true },
  { href: "/feedback", label: "Feedback" },
];

const AUTH_NAV_LINKS = [{ href: "/dashboard", label: "My Registrations" }];

export default function KratosNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, profile, user, signOut, loading } = useAuth();
  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  return (
    <header>
      <div className="navwrap">
        <Link href="/" className="navbrand">
            <img src="/assets/img/easwari-logo.webp" alt="Easwari Engineering College" loading="lazy" />
          <span className="brand-text">
            <span className="brand-red">KRA</span>
            <span className="brand-gold">T</span>
            <span className="brand-red">OS&apos;26</span>
          </span>
        </Link>
        <button
          className="navtoggle"
          type="button"
          aria-label={navOpen ? "Close menu" : "Open menu"}
          aria-expanded={navOpen}
          onClick={() => setNavOpen((v) => !v)}
        >
          ☰
        </button>
        <nav className={`links${navOpen ? " open" : ""}`} id="navLinks">
          {NAV_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setNavOpen(false)}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href)) ? "active" : ""}
                onClick={() => setNavOpen(false)}
              >
                {link.label}
              </Link>
            ),
          )}
          {isAuthenticated
            ? AUTH_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={pathname === link.href || pathname.startsWith("/registrations") ? "active" : ""}
                  onClick={() => setNavOpen(false)}
                >
                  {link.label}
                </Link>
              ))
            : null}
        </nav>
        <div className="nav-right">
          <img className="nav-org-logo" src="/assets/img/dept-logo.webp" alt="CSE Department" loading="lazy" />
          <img className="nav-org-logo nav-ace-logo" src="/assets/img/ace-logo.webp" alt="ACE" loading="lazy" />
          {!loading && !isAuthenticated && (
            <Link href={`/signin?next=${encodeURIComponent(pathname || "/")}`} className="nav-signin">
              <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#fff" d="M21.35 12.23c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.26Z" />
                <path fill="#fff" d="M12 21.67c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.67Z" />
                <path fill="#fff" d="M6.54 13.75a5.86 5.86 0 0 1 0-3.5V7.72H3.3a9.74 9.74 0 0 0 0 8.56l3.24-2.53Z" />
                <path fill="#fff" d="M12 6.22c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.3 14.63 2.33 12 2.33A9.74 9.74 0 0 0 3.3 7.72l3.24 2.53C7.31 7.94 9.46 6.22 12 6.22Z" />
              </svg>
              Sign in
            </Link>
          )}
          <div
            className="nav-profile"
            ref={profileRef}
            role="button"
            tabIndex={0}
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            onClick={(e) => {
              e.stopPropagation();
              setProfileOpen((v) => !v);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setProfileOpen((v) => !v);
              }
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <circle cx="12" cy="8" r="4" />
              <path d="M12 14c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z" />
            </svg>
            <div className={`profile-dd${profileOpen ? " open" : ""}`} role="menu">
              {isAuthenticated ? (
                <>
                  <p>
                    <strong>{profile?.full_name || user?.email}</strong>
                    <br />
                    {user?.email}
                  </p>
                  <Link href="/dashboard" className="dd-link" role="menuitem" onClick={() => setProfileOpen(false)}>
                    My registrations →
                  </Link>
                  <Link
                    href="/dashboard#profile"
                    className="dd-link"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                  >
                    Profile →
                  </Link>
                  <button
                    type="button"
                    className="dd-link dd-btn"
                    role="menuitem"
                    onClick={async () => {
                      setProfileOpen(false);
                      await signOut();
                      router.push("/");
                    }}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <p>
                    <strong>Not signed in.</strong>
                    <br />
                    Sign in with Google to register and manage events.
                  </p>
                  <Link
                    href={`/signin?next=${encodeURIComponent(pathname || "/")}`}
                    className="dd-link"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                  >
                    Sign in →
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
