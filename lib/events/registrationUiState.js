/**
 * Participant-facing registration / event CTA state.
 * Maps backend fields only — no invented statuses.
 *
 * State matrix (expected):
 * | registration_availability (backend)      | registration | payment | → code / cta
 * | OPEN                                     | none         | —       | OPEN / register
 * | FULL                                     | —            | —       | FULL / none
 * | CLOSED                                   | —            | —       | REGISTRATION_CLOSED / none
 * | missing availability + registration_open=false | —      | —       | UNKNOWN / none (not CLOSED)
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

  const availability = String(event?.registration_availability || "").toUpperCase();
  if (availability) {
    if (availability === "OPEN") {
      return { code: "OPEN", label: "Open", tone: "ok", cta: "register" };
    }
    if (availability === "FULL") {
      return { code: "FULL", label: "Full", tone: "err", cta: "none" };
    }
    if (availability === "CLOSED") {
      return { code: "REGISTRATION_CLOSED", label: "Registration closed", tone: "muted", cta: "none" };
    }
  }

  if (event?.registration_open === true) {
    return { code: "OPEN", label: "Open", tone: "ok", cta: "register" };
  }
  if (event?.registration_open === false) {
    return { code: "UNKNOWN", label: "Status unavailable", tone: "default", cta: "none" };
  }
  return { code: "UNKNOWN", label: formatCategory(event?.category), tone: "default", cta: "none" };
}

export function findMyRegistrationForEvent(registrations, eventId) {
  if (!Array.isArray(registrations) || !eventId) return null;
  return (
    registrations.find(
      (r) => String(r.event_id) === String(eventId) && String(r.status).toUpperCase() !== "CANCELLED"
    ) || null
  );
}

function teamStatus(registration) {
  return String(registration?.team?.status || "").toUpperCase();
}

/**
 * Journey substates for registration detail / list (backend fields only).
 */
export function deriveRegistrationJourneyState(registration, event, opts = {}) {
  const base = deriveEventUiState(event, registration, opts);
  const role = base.role;
  const pay = payStatus(registration);
  const team = registration?.team;
  const teamSt = teamStatus(registration);

  if (!team || role !== "LEADER") {
    return { ...base, rosterLine: null, canShareInvite: false };
  }

  const required = team.required_member_count ?? event?.required_member_count ?? null;
  const subs = team.substitute_count ?? event?.substitute_count ?? 0;
  const mandatoryFilled = team.mandatory_filled ?? null;
  const subsFilled = team.substitutes_filled ?? null;

  let rosterLine = null;
  if (required != null) {
    const m = mandatoryFilled != null ? mandatoryFilled : "?";
    const s = subs > 0 && subsFilled != null ? ` · Subs ${subsFilled}/${subs}` : "";
    rosterLine = `Mandatory ${m}/${required}${s}`;
  }

  const paid = pay === "PAID" || regStatus(registration) === "CONFIRMED";
  const inviteReady =
    paid && (teamSt === "PAID" || teamSt === "COMPLETE") && event?.allow_team_invite_flow !== false;

  if (!paid && teamSt === "FORMING") {
    return {
      ...base,
      code: "TEAM_FORMING",
      label: "Team forming",
      tone: "warn",
      rosterLine,
      canShareInvite: false,
    };
  }

  if (inviteReady && required != null && mandatoryFilled != null && mandatoryFilled < required) {
    return {
      ...base,
      code: "TEAM_ROSTER_INCOMPLETE",
      label: "Roster incomplete",
      tone: "warn",
      rosterLine,
      canShareInvite: true,
    };
  }

  if (inviteReady) {
    return {
      ...base,
      code: "TEAM_PAID_INVITE_READY",
      label: "Invite members",
      tone: "ok",
      rosterLine,
      canShareInvite: true,
    };
  }

  return { ...base, rosterLine, canShareInvite: false };
}
