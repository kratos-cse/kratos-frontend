import { Space_Grotesk } from 'next/font/google';
import "./globals.css";
import "@/components/LiquidEther/LiquidEther.css";
import LiquidEther from "@/components/LiquidEther/LiquidEther";
import { AuthProvider } from "@/context/AuthProvider";
import { EventsProvider } from "@/context/EventsProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
});

export const metadata = {
  title: "Hack the Future 2.0 | Kratos'26",
  description:
    "A 24-hour hackathon by Kratos'26 at Easwari Engineering College.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif" }}>
       <div className="global-ether">
        <LiquidEther />
       </div>
        

        {/* ================= NAVBAR ================= */}
        <nav className="navbar">
          <div className="nav-inner">

            {/* LEFT — SRM + KRATOS LION */}
            <div className="nav-left">
              <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img src="/srm-logo.png" alt="SRM" />
                <img
                    src ="/lion-logo.png"
                    alt="Kratos Lion"
                    className="lion-logo"
                />
              </a>
            </div>

            {/* CENTER — NAVIGATION */}
            <div className="nav-links">
              <a href="/#hero">Home</a>
              <a href="/#domains">Domains</a>
              <a href="/#timeline">Timeline</a>
              <a href="/#prizes">Prizes</a>
              <a href="/#rules">Rules</a>
              <a href="/#faq">FAQ</a>
              <a href="/#venue">Venue</a>

              <a
                href="/login?mode=register"
                className="btn-neon"
                style={{
                  padding: "8px 20px",
                  fontSize: "11px",
                }}
              >
                Register
              </a>
            </div>

            
            {/* RIGHT — ACE + EASWARI + CSI */}
            <div className="nav-right">
              <img src="/ace-logo.png" alt="ACE" />

              <img
                src="/easwari-logo.png"
                alt="Easwari Engineering College"
              />

              <img
                src="/csi-logo.png"
                alt="CSI"
                className="csi-logo"
              />
            </div>

          </div>
        </nav>

        <AuthProvider>
          <EventsProvider>
            {children}
          </EventsProvider>
        </AuthProvider>

        {/* ================= FOOTER ================= */}
        <footer>
          <div className="container">

            <div className="foot-logos">
              <img
                src="/easwari-logo.png"
                alt="Easwari Engineering College"
              />

              

              <img src="/ace-logo.png" alt="ACE" />
              <img src="/srm-logo.png" alt="SRM" />
            </div>

            <p>
              Hack the Future 2.0 &mdash; Kratos&apos;26 &middot; Dept. of CSE,
              Easwari Engineering College.
            </p>

            <p
              style={{
                marginTop: 6,
                opacity: 0.6,
              }}
            >
              &copy; 2026 Kratos&apos;26. All rights reserved.
            </p>

          </div>
        </footer>
      </body>
    </html>
  );
}
