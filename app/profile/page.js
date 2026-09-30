"use client";

import { PageShell } from "@/components/layout/PageShell";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProfileSkeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthProvider";
import styles from "./profile.module.css";

function ProfileInner() {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className={styles.wrap}>
      <header>
        <h1 className="page-title">Profile</h1>
        <p className="page-lead">Account and participant details used for registrations.</p>
      </header>

      <Card className="stack">
        <div>
          <p className="meta">Signed in as</p>
          <p className={styles.email}>{user?.email}</p>
        </div>
        <ProfileForm submitLabel="Save changes" />
      </Card>

      <Card className={styles.danger}>
        <h2 className={styles.h2}>Session</h2>
        <p className="muted">Sign out on this device. Your registrations remain on the server.</p>
        <Button variant="danger" type="button" onClick={() => signOut()}>
          Log out
        </Button>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <PageShell>
      <RequireAuth>
        <ProfileInner />
      </RequireAuth>
    </PageShell>
  );
}
