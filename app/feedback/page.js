import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeedbackForm from "@/components/FeedbackForm";

export const metadata = {
  title: "Feedback — Kratos'26",
};

export default function FeedbackPage() {
  return (
    <>
      <Header showBrandIcon />
      <main>
        <section className="page-banner">
          <div className="container">
            <span className="eyebrow">Tell Us Where It Landed</span>
            <h1>Feedback</h1>
            <p>Whether you competed, judged, or just walked through — this shapes next year&apos;s symposium.</p>
          </div>
        </section>
        <section id="feedback">
          <div className="container">
            <div className="map-wrap">
              <iframe
                src="https://www.google.com/maps?q=SRM+Easwari+Engineering+College,+Ramapuram,+Chennai&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                title="Map"
              />
            </div>
            <div className="feedback-panel">
              <div className="feedback-copy">
                <h3>Why it matters</h3>
                <p>Every response is read by the organizing core before next year&apos;s planning.</p>
                <ul>
                  <li>Shapes which events return, merge, or retire</li>
                  <li>Flags scheduling clashes across tracks</li>
                  <li>Surfaces judging and logistics issues early</li>
                </ul>
              </div>
              <FeedbackForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
