import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { NavigationProgress } from "./NavigationProgress";

export function PageShell({ children, wide = false }) {
  return (
    <div className="app-shell">
      <NavigationProgress />
      <Navbar />
      <main className={`app-main ${wide ? "container--wide" : "container"} page`}>{children}</main>
      <Footer />
    </div>
  );
}
