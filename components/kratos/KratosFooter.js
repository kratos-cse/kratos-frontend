import Link from "next/link";

export default function KratosFooter({ categories = [] }) {
  return (
    <footer>
      <div className="foot-inner">
        <div className="foot-grid">
          <div className="foot-brand">
            <div className="foot-logos">
              <img src="/assets/img/dept-logo.webp" alt="Dept of CSE" loading="lazy" />
              <img className="foot-wordmark" src="/assets/img/kratos-wordmark.webp" alt="Kratos'26" loading="lazy" />
              <img className="foot-ace" src="/assets/img/ace-logo.webp" alt="ACE" loading="lazy" />
            </div>
            <p className="foot-tag">ACE National Symposium</p>
          </div>
          <div className="foot-addr">
            <h4>Find Us</h4>
            <span className="college-name">SRM Easwari Engineering College</span>
            <span className="dept-name">Department of Computer Science &amp; Engineering</span>
            Ramapuram, Chennai — 600 089
            <div className="pin">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2C7.6 2 4 5.6 4 10c0 6 8 12 8 12s8-6 8-12c0-4.4-3.6-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
              </svg>
              Ramapuram, Chennai, Tamil Nadu, India
            </div>
          </div>
          <div className="foot-col">
            <h4>Explore</h4>
            <nav className="foot-nav">
              <Link href="/">Home</Link>
              <Link href="/technical">Technical</Link>
              <Link href="/spark">Spark</Link>
              <Link href="/playground">Playground</Link>
              <Link href="/online">Online</Link>
              <Link href="/feedback">Feedback</Link>
              <Link href="/dashboard">Dashboard</Link>
            </nav>
          </div>
        </div>
        <div className="foot-bottom">
          <p className="foot-fine">
            © Kratos&apos;26 — Association of Computer Engineers, SRM Easwari Engineering College. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
