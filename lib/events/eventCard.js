import { formatCategory } from "./categories";
import { deriveEventUiState } from "./registrationUiState";
import { formatFee, formatRosterLabel, formatWhen } from "./utils";

/** Editorial uppercase category label for discovery cards. */
export function formatCategoryEditorial(category) {
  return String(formatCategory(category) || "GENERAL").toUpperCase();
}

/** Scannable schedule line — e.g. `12 OCT · 9:00 AM`. */
export function formatCardWhen(startsAt, endsAt, slot) {
  if (startsAt) {
    try {
      const d = new Date(startsAt);
      const day = d.getDate();
      const month = d
        .toLocaleString("en-IN", { month: "short" })
        .replace(/\./g, "")
        .toUpperCase();
      const time = d
        .toLocaleTimeString("en-IN", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
        .toUpperCase();
      return `${day} ${month} · ${time}`;
    } catch {
      /* fall through */
    }
  }
  const fallback = formatWhen(startsAt, endsAt, slot);
  if (!fallback || fallback === "Schedule TBA") return fallback;
  return String(fallback).toUpperCase();
}

/** Fee display for cards — preserves `formatFee` but uppercases free events. */
export function formatFeeCard(fee) {
  const formatted = formatFee(fee);
  if (formatted === "Free") return "FREE";
  return formatted;
}

/** From backend `registration_mode` only — never inferred from team sizes. */
export function formatRegistrationModeShort(mode) {
  const m = String(mode || "").toUpperCase();
  if (m === "INDIVIDUAL_ONLY") return "INDIVIDUAL";
  if (m === "TEAM_ONLY") return "TEAM";
  if (m === "TEAM_OR_INDIVIDUAL") return "INDIVIDUAL OR TEAM";
  return null;
}

/** Team roster line for cards — null for individual-only events. */
export function formatRosterCardLine(event) {
  const mode = String(event?.registration_mode || "").toUpperCase();
  if (mode === "INDIVIDUAL_ONLY") return null;

  const roster = formatRosterLabel(
    event?.required_member_count,
    event?.substitute_count,
    event?.team_min_size,
    event?.team_max_size,
  );
  if (!roster) return null;

  let line = roster
    .replace(/ members$/i, " MEMBERS")
    .replace(/ substitutes$/i, " SUBSTITUTES")
    .replace(/ substitute$/i, " SUBSTITUTE");

  const regMode = formatRegistrationModeShort(event?.registration_mode);
  if (regMode === "TEAM") return `TEAM · ${line}`;
  if (regMode === "INDIVIDUAL OR TEAM") return `${line}`;
  return line;
}

/** Text status for the card — never color-only. */
export function deriveEventCardStatus(event, ui) {
  if (ui.code === "FULL") {
    return { text: "EVENT FULL", tone: "err", showDot: false };
  }
  if (ui.code === "REGISTRATION_CLOSED") {
    return { text: "REGISTRATION CLOSED", tone: "muted", showDot: false };
  }
  if (ui.code === "PAYMENT_PENDING") {
    return { text: "PAYMENT PENDING", tone: "warn", showDot: false };
  }
  if (ui.code === "PAYMENT_FAILED") {
    return { text: "PAYMENT FAILED", tone: "err", showDot: false };
  }
  if (ui.code === "COMPLETE") {
    return { text: "✓ REGISTERED", tone: "ok", showDot: false };
  }
  if (ui.code === "TEAM_MEMBER" || ui.code === "TEAM_SUBSTITUTE") {
    return { text: "TEAM MEMBER", tone: "ok", showDot: false };
  }
  if (ui.code === "OPEN") {
    return { text: "REGISTRATION OPEN", tone: "ok", showDot: true };
  }

  return {
    text: String(ui.label || "STATUS").toUpperCase(),
    tone: ui.tone || "default",
    showDot: false,
  };
}

function activeMembers(team) {
  return (team?.members || []).filter(
    (m) => !["LEFT", "REMOVED"].includes(String(m.status).toUpperCase()),
  );
}

/** Concise roster counts for team leaders on the card. */
export function deriveTeamLeaderSummary(event, registration, profileId) {
  if (!registration?.team) return null;
  const ui = deriveEventUiState(event, registration, { profileId });
  if (ui.code !== "TEAM_LEADER") return null;

  const members = activeMembers(registration.team);
  const required = Number(event?.required_member_count ?? event?.team_min_size ?? 0) || null;
  const maxSubs = Number(
    event?.substitute_count ??
      (event?.team_max_size != null && event?.team_min_size != null
        ? Math.max(0, Number(event.team_max_size) - Number(event.team_min_size))
        : 0),
  );
  const mandatory = members.filter((m) =>
    ["LEADER", "MEMBER"].includes(String(m.role).toUpperCase()),
  ).length;
  const subs = members.filter((m) => String(m.role).toUpperCase() === "SUBSTITUTE").length;

  return {
    teamName: registration.team.name,
    mandatory,
    required,
    subs,
    maxSubs,
  };
}

/** View Event + primary registration action — separate paths, clear hierarchy. */
export function deriveEventCardActions(event, registration, ui, { isAuthenticated } = {}) {
  const detailHref = `/events/${event.id}`;
  const regHref = registration?.id ? `/registrations/${registration.id}` : null;
  const registerHref = `/register/${event.id}`;
  const loginHref = `/login?next=${encodeURIComponent(registerHref)}`;

  let primary = null;

  if (ui.cta === "register") {
    primary = {
      label: "Register",
      href: isAuthenticated ? registerHref : loginHref,
      variant: "primary",
    };
  } else if (ui.cta === "pay") {
    primary = {
      label: "Continue",
      href: regHref,
      variant: "primary",
    };
  } else if (ui.cta === "view" && ui.code === "TEAM_LEADER") {
    primary = {
      label: "Manage Team",
      href: regHref,
      variant: "primary",
    };
  } else if (ui.cta === "view" && regHref) {
    primary = {
      label: "View Registration",
      href: regHref,
      variant: "primary",
    };
  }

  return {
    view: { label: "View Event ↗", href: detailHref },
    primary,
  };
}
