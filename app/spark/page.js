import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventsGrid from "@/components/EventsGrid";

export const metadata = {
  title: "Spark — Kratos'26",
};

export default function SparkPage() {
  return (
    <>
      <Header showBrandIcon />
      <main>
        <section className="page-banner">
          <div className="container">
            <span className="eyebrow">Opening Charge</span>
            <h1>Spark</h1>
            <p>The inaugural ceremony and keynote that opens every track at once.</p>
          </div>
        </section>
        <section>
          <div className="container">
            <EventsGrid category="Spark" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
