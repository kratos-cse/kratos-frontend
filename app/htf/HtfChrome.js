/* eslint-disable @next/next/no-img-element -- HTF PR markup uses static sponsor logos */
import { HTF_REGISTRATION_URL } from "@/lib/links";

const NAV = [
  { href: "/htf#hero", label: "Home" },
  { href: "/htf#domains", label: "Domains" },
  { href: "/htf#timeline", label: "Timeline" },
  { href: "/htf#prizes", label: "Prizes" },
  { href: "/htf#rules", label: "Rules" },
  { href: "/htf#faq", label: "FAQ" },
  { href: "/htf#venue", label: "Venue" },
];

export function HtfChrome({ children }) {
  return (
    <>
      <nav className="navbar">
        <div className="nav-inner">
          <div className="nav-left">
            <a href="/htf#hero" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src="/srm-logo.png" alt="SRM" />
              <img src="/lion-logo.png" alt="Kratos Lion" className="lion-logo" />
            </a>
          </div>

          <div className="nav-links">
            {NAV.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
            <a
              href={HTF_REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-neon"
              style={{ padding: "8px 20px", fontSize: "11px" }}
            >
              Register
            </a>
          </div>

          <div className="nav-right">
            <img src="/ace-logo.png" alt="ACE" />
            <img src="/easwari-logo.png" alt="Easwari Engineering College" />
            <img src="/CSI-logo.png" alt="CSI" className="csi-logo" />
          </div>
        </div>
      </nav>

      {children}

      <footer>
        <div className="container">
          <div className="foot-logos">
            <img src="/easwari-logo.png" alt="Easwari Engineering College" />
            <img src="/ace-logo.png" alt="ACE" />
            <img src="/srm-logo.png" alt="SRM" />
          </div>
          <p>
            Hack the Future 2.0 &mdash; Kratos&apos;26 &middot; Dept. of CSE, Easwari Engineering College.
          </p>
          <p style={{ marginTop: 6, opacity: 0.6 }}>&copy; 2026 Kratos&apos;26. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
