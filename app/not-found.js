import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <PageShell>
      <div className="stack" style={{ maxWidth: "28rem", paddingBlock: "var(--space-7)" }}>
        <p className="meta">404</p>
        <h1 className="page-title">Page not found</h1>
        <p className="page-lead">That route doesn’t exist. Head back to events and keep exploring.</p>
        <div className="row">
          <Button href="/events">Explore Events</Button>
          <Button href="/" variant="ghost">
            Home
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
