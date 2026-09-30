import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { canInviteTeammatesLater, canLeaderEnterMembers } from "@/lib/events/rosterPlan";
import styles from "./TeamMateChoice.module.css";

export function TeamMateChoice({ event, onAddNow, onInviteLater, onBack, busy }) {
  const showAdd = canLeaderEnterMembers(event);
  const showInvite = canInviteTeammatesLater(event);

  return (
    <Card className={styles.wrap}>
      <h2 className={styles.title}>How would you like to add your teammates?</h2>

      {showAdd ? (
        <div className={styles.option}>
          <h3 className={styles.optionTitle}>Add teammates now</h3>
          <p className="muted">
            Add your teammates&apos; details now. You can stop anytime and continue to payment.
          </p>
          <Button type="button" onClick={onAddNow} loading={busy}>
            Add Teammates Now
          </Button>
        </div>
      ) : null}

      {showInvite ? (
        <div className={styles.option}>
          <h3 className={styles.optionTitle}>Invite teammates to join</h3>
          <p className="muted">
            Continue to payment without adding teammate details. After payment, invite your teammates
            from your team page. They&apos;ll receive an invitation and can enter their own details.
          </p>
          <Button type="button" variant="secondary" onClick={onInviteLater} loading={busy}>
            Continue &amp; Invite Later
          </Button>
        </div>
      ) : null}

      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={onBack} disabled={busy}>
          Back
        </Button>
      </div>
    </Card>
  );
}
