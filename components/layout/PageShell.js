import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { NavigationProgress } from "./NavigationProgress";

export function PageShell({ children, wide = false, immersive = false }) {
  const mainClass = immersive
    ? "app-main app-main--immersive"
    : `app-main ${wide ? "container--wide" : "container"} page`;

  return (
    <div className="app-shell">
      <NavigationProgress />
      <Navbar />
      <main className={mainClass}>{children}</main>
      <Footer />
    </div>
  );
}
