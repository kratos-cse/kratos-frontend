import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventsGrid from "@/components/EventsGrid";

export const metadata = {
  title: "Sports Events — Kratos'26",
};

export default function SportsPage() {
  return (
    <>
      <Header showBrandIcon />
      <main>
        <section className="page-banner">
          <div className="container">
            <span className="eyebrow">Arena Floor</span>
            <h1>Sports Events</h1>
            <p>Step outside the lab and settle things on the field.</p>
          </div>
        </section>
        <section>
          <div className="container">
            <EventsGrid category="Sports" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
