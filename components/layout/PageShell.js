import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export function PageShell({ children, wide = false }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className={`app-main ${wide ? "container--wide" : "container"} page`}>{children}</main>
      <Footer />
    </div>
  );
}
