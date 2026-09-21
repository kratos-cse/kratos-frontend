import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventsGrid from "@/components/EventsGrid";

export const metadata = {
  title: "Online Events — Kratos'26",
};

export default function OnlinePage() {
  return (
    <>
      <Header showBrandIcon />
      <main>
        <section className="page-banner">
          <div className="container">
            <span className="eyebrow">From Anywhere</span>
            <h1>Online Events</h1>
            <p>Fully online, open to every college, no travel required.</p>
          </div>
        </section>
        <section>
          <div className="container">
            <EventsGrid category="Online" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
