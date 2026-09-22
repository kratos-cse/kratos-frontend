"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/technical", label: "Technical" },
  { href: "/spark", label: "Spark" },
  { href: "/online", label: "Online" },
  { href: "/sports", label: "Sports" },
  { href: "https://unstop.com", label: "Hackathon", external: true },
  { href: "/feedback", label: "Feedback" },
];

export default function Header({ showBrandIcon = false, onSignIn }) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  function handleSignIn(e) {
    // On the home page, this opens the registrations panel in place.
    // On other pages, the anchor's href handles navigation to /#registrations.
    if (onSignIn) onSignIn(e);
  }

  return (
    <header>
      <div className="navwrap">
        <Link href="/" className="navbrand">
          <img src="/assets/img/easwari-logo.webp" alt="Easwari Engineering College" loading="lazy" />
          <span>KRATOS&apos;26</span>
        </Link>
        <button className="navtoggle" id="navToggle" aria-label="Menu" onClick={() => setNavOpen((v) => !v)}>
          ☰
        </button>
        <nav className={`links${navOpen ? " open" : ""}`} id="navLinks">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "active" : ""}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener" : undefined}
              onClick={() => setNavOpen(false)}
            >
              {link.label}{link.external && <span className="nav-arrow"> ↗</span>}
            </Link>
          ))}
        </nav>
        <div className="nav-right">
          <img className="nav-org-logo" src="/assets/img/dept-logo.webp" alt="CSE Department" loading="lazy" />
          <img className="nav-org-logo nav-ace-logo" src="/assets/img/ace-logo.webp" alt="ACE" loading="lazy" />
          <a href="/#registrations" id="signInBtn" className="nav-signin" onClick={handleSignIn}>
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M21.35 11.1H12v2.9h5.35c-.5 2.5-2.6 4.3-5.35 4.3-3.25 0-5.9-2.65-5.9-5.9s2.65-5.9 5.9-5.9c1.5 0 2.85.55 3.9 1.5l2.15-2.15C16.55 4.35 14.4 3.5 12 3.5 6.85 3.5 2.7 7.65 2.7 12.8s4.15 9.3 9.3 9.3c5.35 0 8.9-3.75 8.9-9.05 0-.65-.05-1.15-.15-1.95z"
              />
            </svg>
            Sign in
          </a>
          <div className="nav-profile" id="profileBtn" ref={profileRef} onClick={(e) => { e.stopPropagation(); setProfileOpen((v) => !v); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="8" r="4" />
              <path d="M12 14c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z" />
            </svg>
            <div className={`profile-dd${profileOpen ? " open" : ""}`} id="profileDD">
              <p>
                <strong>Not signed in.</strong>
                <br />
                Sign in with Google to view your registered events.
              </p>
              <Link href="/#registrations" className="dd-link">
                Sign in →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
