import Splash from "./components/Splash";
import TiltLion from "./components/TiltLion";
import StackedCardStack from "./components/StackedCardStack";
import DomainCard from "./components/DomainCard";
import Timeline from "./components/Timeline";

const UNSTOP_LINK = "https://unstop.com/YOUR-EVENT-LINK-HERE";

export default function Home() {
  return (
    <main>
      <Splash />

      {/* ========== HERO DASHBOARD ========== */}
      <section className="hero-dashboard" id="hero">
        <div className="hero-center">

          {/* Kratos brand — lion + text, centered */}
          <div className="kratos-brand-row">
            <TiltLion />
            <div className="kratos-img">
              <img src="/kratos-text.png" alt="Kratos'26" />
            </div>
          </div>

          {/* HTF title — centered below */}
          <div className="htf-title">
            <img src="/htf-full.png" alt="Hack to the Future 2.0" />
          </div>

          <div className="hero-eyebrow">
            <span className="dot-live" /> Registrations Open
          </div>

          <div className="hero-date">
            <span>9 OCT</span>
            <span className="sep">—</span>
            <span>10 OCT 2026</span>
            <span className="sep">|</span>
            <span>24 HRS</span>
          </div>

          <p className="hero-sub">
            A 24-hour national-level hackathon where bold ideas meet real code.
            Build, break, and ship something that matters — under one neon-lit
            roof, against the clock.
          </p>

          <div className="hero-cta">
            <a href={UNSTOP_LINK} target="_blank" rel="noopener noreferrer" className="btn-neon">
              Register on Unstop
            </a>
            <a href="#domains" className="btn-ghost">
              Explore Event
            </a>
          </div>

          <div className="meta-strip">
            <div className="meta-chip">📍 <b>Easwari Engineering College</b></div>
            <div className="meta-chip">👥 Teams of <b>2 – 4</b></div>
            <div className="meta-chip">🏆 <b>₹1L+</b> Prizes</div>
          </div>
        </div>
      </section>

      {/* ========== ABOUT ========== */}
      <section id="about">
        <div className="container">
          <h2 className="section-title">About <span>the Hackathon</span></h2>
          <p className="section-sub">
            Hack the Future 2.0 is Kratos&apos;26&apos;s flagship 24-hour hackathon,
            hosted by the Department of CSE at Easwari Engineering College.
            Student innovators from across the country form teams, pick a
            problem statement, and build a working prototype from scratch.
          </p>
          <div className="grid-3">
            <div className="card">
              <div className="icon-badge">🚀</div>
              <h3>Build Fast, Build Real</h3>
              <p>Take an idea from a blank repo to a working demo in 24 hours, with mentors on hand.</p>
            </div>
            <div className="card">
              <div className="icon-badge">🧠</div>
              <h3>Learn from the Best</h3>
              <p>Workshops and mentor rounds from engineers working on AI, fintech, and product at scale.</p>
            </div>
            <div className="card">
              <div className="icon-badge">🏆</div>
              <h3>Real Prizes</h3>
              <p>Cash prizes, certificates, internship referrals, and incubation support for standout builds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== INSTRUCTIONS ========== */}
      <section id="instructions">
        <div className="container">
          <h2 className="section-title">Event <span>Instructions</span></h2>
          <p className="section-sub">Essentials to know before you arrive.</p>
          <div className="grid-4">
            <div className="card">
              <div className="icon-badge">🎒</div>
              <h3>What to Bring</h3>
              <p>Laptop, charger, college ID, and your registration confirmation.</p>
            </div>
            <div className="card">
              <div className="icon-badge">🛠</div>
              <h3>Any Stack</h3>
              <p>Any language or framework. Pre-built boilerplate OK; core logic must be built on-site.</p>
            </div>
            <div className="card">
              <div className="icon-badge">🌙</div>
              <h3>Overnight Stay</h3>
              <p>Venue stays open through the night. Separate rest areas provided.</p>
            </div>
            <div className="card">
              <div className="icon-badge">🍽</div>
              <h3>Meals Included</h3>
              <p>Meals, snacks, and refreshments for the full 24 hours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== DOMAINS ========== */}
      <section id="domains" className="domains-stack-section">
        <div className="container">
          <h2 className="section-title">Domains &amp; <span>Problem Statements</span></h2>
          <p className="section-sub">Pick a track. Detailed PS released to registered teams closer to the event.</p>
        </div>

        <StackedCardStack topOffset={86} stackGap={18} cardMinHeight="76vh">
          <DomainCard
            number="01"
            title="AI & Machine Learning"
            subtitle="Intelligence that matters."
            desc="Applied ML, generative AI, and intelligent automation for real-world problems."
            icon="🤖"
            tags={["GenAI", "CV", "NLP"]}
            variant={1}
          />
          <DomainCard
            number="02"
            title="FinTech & Payments"
            subtitle="Build the next financial layer."
            desc="Secure, fast, inclusive digital payment and financial technology solutions."
            icon="💳"
            tags={["Payments", "Fraud", "Open Banking"]}
            variant={2}
          />
          <DomainCard
            number="03"
            title="Web3 & Cybersecurity"
            subtitle="Trust the next internet."
            desc="Build systems for security, privacy, trust, decentralization, and resilient digital infrastructure."
            icon="🛡️"
            tags={["Blockchain", "Security"]}
            variant={3}
          />
          <DomainCard
            number="04"
            title="HealthTech"
            subtitle="Technology for better care."
            desc="Technology improving access, diagnosis, patient experience, and quality of care."
            icon="🏥"
            tags={["Digital Health", "Wearables"]}
            variant={4}
          />
          <DomainCard
            number="05"
            title="Sustainability"
            subtitle="Build for a livable future."
            desc="Climate-conscious solutions for energy, mobility, waste, and smarter urban living."
            icon="🌱"
            tags={["CleanTech", "Smart Cities"]}
            variant={5}
          />
          <DomainCard
            number="06"
            title="Open Innovation"
            subtitle="No box. No limits."
            desc="Have a wild idea that does not fit a category? Build something meaningful and make it real."
            icon="⚡"
            tags={["Anything Goes"]}
            variant={6}
          />
        </StackedCardStack>
      </section>

      {/* ========== TIMELINE ========== */}
      <Timeline />

      {/* ========== PRIZES ========== */}
      <section id="prizes">
        <div className="container">
          <h2 className="section-title">Prizes &amp; <span>Rewards</span></h2>
          <p className="section-sub">Total prize pool worth ₹1,00,000+</p>
          <div className="grid-3">
            <div className="card prize-card">
              <div className="rank">🥇 WINNER</div>
              <div className="amount">₹50,000</div>
              <p style={{ marginTop: 10 }}>+ Certificates &amp; Internship Referrals</p>
            </div>
            <div className="card prize-card">
              <div className="rank">🥈 RUNNER-UP</div>
              <div className="amount">₹30,000</div>
              <p style={{ marginTop: 10 }}>+ Certificates &amp; Goodies</p>
            </div>
            <div className="card prize-card">
              <div className="rank">🥉 2ND RUNNER-UP</div>
              <div className="amount">₹20,000</div>
              <p style={{ marginTop: 10 }}>+ Certificates &amp; Goodies</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== REGISTRATION FEE ========== */}
      <section id="register">
        <div className="container">
          <h2 className="section-title">Registration <span>Fee</span></h2>
          <div className="fee-box">
            <div>
              <div className="fee-amount">₹500 <small>/ team of up to 4</small></div>
              <p style={{ color: "var(--text-dim)", marginTop: 8, maxWidth: 460 }}>
                Includes kit, meals, mentorship, and certificate for every team member.
              </p>
            </div>
            <a href={UNSTOP_LINK} target="_blank" rel="noopener noreferrer" className="btn-neon">
              Register Now on Unstop →
            </a>
          </div>
        </div>
      </section>

      {/* ========== RULES ========== */}
      <section id="rules">
        <div className="container">
          <h2 className="section-title">Rules &amp; <span>Regulations</span></h2>
          <div className="grid-2">
            <ul className="rules-list">
              <li><span className="num">01</span>Teams of 2–4 members. Cross-college teams allowed.</li>
              <li><span className="num">02</span>All code must be written during the 24-hour window. No pre-built submissions.</li>
              <li><span className="num">03</span>Public APIs, libraries, and boilerplate templates are allowed.</li>
              <li><span className="num">04</span>Plagiarism or copying leads to immediate disqualification.</li>
            </ul>
            <ul className="rules-list">
              <li><span className="num">05</span>Submit project + demo video before the deadline.</li>
              <li><span className="num">06</span>Judging panel decisions are final and binding.</li>
              <li><span className="num">07</span>Carry a valid college ID and registration confirmation.</li>
              <li><span className="num">08</span>Misconduct or disruption → disqualification without refund.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ========== VENUE & MAP ========== */}
      <section id="venue">
        <div className="container">
          <h2 className="section-title">Venue &amp; <span>Location</span></h2>
          <p className="section-sub">
            Easwari Engineering College, Ramapuram, Chennai — Dept. of CSE.
          </p>
          <div className="grid-2" style={{ alignItems: "start" }}>
            <div className="card">
              <div className="icon-badge">📍</div>
              <h3>Easwari Engineering College</h3>
              <p>Bharathi Salai, Ramapuram, Chennai, TN 600089</p>
              <p style={{ marginTop: 14 }}>
                <b style={{ color: "#fff" }}>Dates:</b> 9 – 10 Oct 2026<br />
                <b style={{ color: "#fff" }}>Duration:</b> 24 Hours<br />
                <b style={{ color: "#fff" }}>Reporting:</b> 8:00 AM, Day 1
              </p>
              <div style={{ marginTop: 20 }}>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Easwari+Engineering+College+Ramapuram+Chennai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  Open in Google Maps ↗
                </a>
              </div>
            </div>
            <div className="map-frame">
              <iframe
                loading="lazy" allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=Easwari+Engineering+College,+Ramapuram,+Chennai&output=embed"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
