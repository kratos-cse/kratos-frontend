import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import { EventsProvider } from "@/context/EventsProvider";

export const metadata = {
  title: "Hack the Future 2.0 | Kratos'26",
  description:
    "A 24-hour hackathon by Kratos'26 at Easwari Engineering College.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Video background with sound */}
        <div className="video-bg">
          <video autoPlay loop playsInline>
            <source src="/bg-video.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="video-overlay" />

        {/* ================= NAVBAR ================= */}
        <nav className="navbar">
          <div className="nav-inner">

            {/* LEFT — SRM + KRATOS LION */}
            <div className="nav-left">
              <img src="/srm-logo.png" alt="SRM" />
            <img
                src ="/lion-logo.png"
                alt="Kratos Lion"
                className="lion-logo"
            />
            </div>

            {/* CENTER — NAVIGATION */}
            <div className="nav-links">
              <a href="#hero">Home</a>
              <a href="#domains">Domains</a>
              <a href="#timeline">Timeline</a>
              <a href="#prizes">Prizes</a>
              <a href="#rules">Rules</a>
              <a href="#faq">FAQ</a>
              <a href="#venue">Venue</a>

              <a
                href="#register"
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