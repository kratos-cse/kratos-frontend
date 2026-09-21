import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventsGrid from "@/components/EventsGrid";

export const metadata = {
  title: "Technical Events — Kratos'26",
};

export default function TechnicalPage() {
  return (
    <>
      <Header showBrandIcon />
      <main>
        <section className="page-banner">
          <div className="container">
            <span className="eyebrow">Build. Debug. Present.</span>
            <h1>Technical Events</h1>
            <p>Paper presentations, hackathons, coding sprints and project expos.</p>
          </div>
        </section>
        <section>
          <div className="container">
            <EventsGrid category="Technical" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
