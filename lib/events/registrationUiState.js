/**
 * Participant-facing registration / event CTA state.
 * Maps backend fields only — no invented statuses.
 *
 * State matrix (expected):
 * | event.status / registration_open / spots | registration | payment | → code / cta
 * | OPEN + open + spots>0                    | none         | —       | OPEN / register
 * | CLOSED|CANCELLED|COMPLETED               | —            | —       | CLOSED / none
 * | registration_open=false                  | —            | —       | REGISTRATION_CLOSED / none
 * | spots_remaining=0                        | —            | —       | FULL / none
 * | open                                     | CANCELLED    | —       | CANCELLED / register
 * | open                                     | PENDING      | — fee0  | PENDING / view
 * | open                                     | PENDING      | CREATED | PAYMENT_PENDING / pay
 * | open                                     | PENDING      | FAILED  | PAYMENT_FAILED / pay
 * | open                                     | PENDING|CONF | PAID    | COMPLETE / view
 * | open                                     | CONFIRMED    | —       | COMPLETE / view
 * | open + team member role LEADER           | active       | paid    | TEAM_LEADER / view
 * | open + team member role MEMBER           | active       | paid    | TEAM_MEMBER / view
 * | open + team member role SUBSTITUTE       | active       | paid    | TEAM_SUBSTITUTE / view
 */

import { formatCategory } from "./categories";

function payStatus(registration) {
  return String(registration?.payment?.status || "").toUpperCase();
}

function regStatus(registration) {
  return String(registration?.status || "").toUpperCase();
}

function myTeamRole(registration, profileId) {
  if (!registration?.team || !profileId) return null;
  const me = (registration.team.members || []).find(
    (m) => String(m.profile_id) === String(profileId)
  );
  if (!me) {
    if (String(registration.team.leader_profile_id) === String(profileId)) return "LEADER";
    return null;
  }
  return String(me.role || "").toUpperCase() || null;
}

/**
 * @param {object|null} event
 * @param {object|null} myRegistration
 * @param {{ profileId?: string }=} opts
 */
export function deriveEventUiState(event, myRegistration, opts = {}) {
  const eventStatus = String(event?.status || "").toUpperCase();
  const fee = Number(event?.fee);
  const hasFee = !Number.isNaN(fee) && fee > 0;

  if (myRegistration) {
    const status = regStatus(myRegistration);
    const pay = payStatus(myRegistration);
    const role = myTeamRole(myRegistration, opts.profileId);

    if (status === "CANCELLED") {
      return { code: "CANCELLED", label: "Cancelled", tone: "muted", cta: "register", role };
    }

    if (status === "CONFIRMED" || pay === "PAID") {
      if (role === "LEADER") {
        return { code: "TEAM_LEADER", label: "Team leader", tone: "ok", cta: "view", role };
      }
      if (role === "MEMBER") {
        return { code: "TEAM_MEMBER", label: "Team member", tone: "ok", cta: "view", role };
      }
      if (role === "SUBSTITUTE") {
        return { code: "TEAM_SUBSTITUTE", label: "Substitute", tone: "ok", cta: "view", role };
      }
      return { code: "COMPLETE", label: "Registered", tone: "ok", cta: "view", role };
    }

    if (pay === "FAILED") {
      return { code: "PAYMENT_FAILED", label: "Payment failed", tone: "err", cta: "pay", role };
    }

    if (pay === "CREATED" || (status === "PENDING" && hasFee)) {
      return { code: "PAYMENT_PENDING", label: "Payment pending", tone: "warn", cta: "pay", role };
    }

    if (status === "PENDING") {
      return { code: "PENDING", label: "Pending", tone: "warn", cta: "view", role };
    }

    return { code: "REGISTERED", label: "Registered", tone: "ok", cta: "view", role };
  }

  if (eventStatus === "CLOSED" || eventStatus === "CANCELLED" || eventStatus === "COMPLETED") {
    return { code: "CLOSED", label: "Closed", tone: "muted", cta: "none" };
  }
  if (event?.registration_open === false) {
    return { code: "REGISTRATION_CLOSED", label: "Registration closed", tone: "muted", cta: "none" };
  }
  if (event?.spots_remaining === 0) {
    return { code: "FULL", label: "Full", tone: "err", cta: "none" };
  }
  if (event?.registration_open === true) {
    return { code: "OPEN", label: "Open", tone: "ok", cta: "register" };
  }
  return { code: "UNKNOWN", label: formatCategory(event?.category), tone: "default", cta: "register" };
}

export function findMyRegistrationForEvent(registrations, eventId) {
  if (!Array.isArray(registrations) || !eventId) return null;
  return (
    registrations.find(
      (r) => String(r.event_id) === String(eventId) && String(r.status).toUpperCase() !== "CANCELLED"
    ) || null
  );
}
