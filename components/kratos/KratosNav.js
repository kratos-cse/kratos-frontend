"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthProvider";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/feedback", label: "Feedback" },
];

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
          <img src="/assets/img/easwari-logo.webp" alt="Easwari Engineering College" />
          <span>KRATOS&apos;26</span>
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
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href)) ? "active" : ""}
              onClick={() => setNavOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="nav-right">
          <img className="nav-org-logo" src="/assets/img/dept-logo.webp" alt="CSE Department" />
          <img className="nav-org-logo nav-ace-logo" src="/assets/img/ace-logo.webp" alt="ACE" />
          {!loading && !isAuthenticated && (
            <Link href={`/login?next=${encodeURIComponent(pathname || "/")}`} className="nav-signin">
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
                    Dashboard →
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
                    href={`/login?next=${encodeURIComponent(pathname || "/")}`}
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
