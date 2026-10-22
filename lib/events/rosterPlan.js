/** Roster slot planning from event + team state (mirrors backend roster_limits / next_join_role). */

import { resolveRosterStyle } from "./utils";

function teamSizeBounds(event) {
  const teamMin = Math.max(1, Number(event?.team_min_size ?? event?.required_member_count ?? 1));
  const teamMax = Math.max(teamMin, Number(event?.team_max_size ?? teamMin));
  return { teamMin, teamMax };
}

function rosterStyle(event) {
  const { teamMin, teamMax } = teamSizeBounds(event);
  return resolveRosterStyle(event?.roster_style, teamMin, teamMax, event?.substitute_count);
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * Merge GET /teams/{id} roster fields when the team response supplies them.
 * Only overwrites event fields that are explicitly present on the team payload
 * (including 0 for substitute_count). Does not replace event config with undefined.
 */
export function coalesceRosterEvent(event, team) {
  if (!event) return null;
  if (!team) return event;

  const merged = { ...event };

  if (typeof team.roster_style === "string" && team.roster_style.trim()) {
    merged.roster_style = team.roster_style.trim();
  }
  if (isFiniteNumber(team.team_max_size)) {
    merged.team_max_size = team.team_max_size;
  }
  if (isFiniteNumber(team.required_member_count)) {
    merged.required_member_count = team.required_member_count;
    if (!isFiniteNumber(event.team_min_size)) {
      merged.team_min_size = team.required_member_count;
    }
  }
  if (isFiniteNumber(team.team_min_size)) {
    merged.team_min_size = team.team_min_size;
  }
  if (isFiniteNumber(team.substitute_count)) {
    merged.substitute_count = team.substitute_count;
  }

  return merged;
}

export function getRosterLimits(event) {
  const { teamMin, teamMax } = teamSizeBounds(event);
  const style = rosterStyle(event);
  const substitutes =
    style === "MEMBERS_SUBSTITUTES" ? Math.max(0, Number(event?.substitute_count ?? 0)) : 0;
  return {
    required: teamMin,
    teamMin,
    teamMax: style === "MEMBERS_SUBSTITUTES" ? teamMin + substitutes : teamMax,
    substitutes,
    style,
  };
}

export function activeMembers(team) {
  const list = Array.isArray(team?.members) ? team.members : [];
  return list.filter((m) => !["LEFT", "REMOVED"].includes(String(m.status).toUpperCase()));
}

export function countMandatory(team) {
  return activeMembers(team).filter((m) => {
    const role = String(m.role).toUpperCase();
    return role === "LEADER" || role === "MEMBER";
  }).length;
}

export function countSubstitutes(team) {
  return activeMembers(team).filter((m) => String(m.role).toUpperCase() === "SUBSTITUTE").length;
}

/**
 * Next slot the leader can fill, or null when roster is full.
 * @returns {{ role: 'MEMBER' | 'SUBSTITUTE', phase: 'mandatory' | 'optional' | 'substitute', index: number, total: number, label: string } | null}
 */
export function getNextRosterSlot(event, team) {
  const { required: teamMin, teamMax, substitutes, style } = getRosterLimits(event);
  const mandatory = countMandatory(team);
  const active = activeMembers(team).length;

  if (mandatory < teamMin) {
    return {
      role: "MEMBER",
      phase: "mandatory",
      index: mandatory,
      total: teamMin,
      label: `Member ${mandatory + 1}`,
    };
  }

  if (style === "MEMBERS_SUBSTITUTES") {
    const subs = countSubstitutes(team);
    if (subs < substitutes && active < teamMax) {
      return {
        role: "SUBSTITUTE",
        phase: "substitute",
        index: subs + 1,
        total: substitutes,
        label: `Substitute ${subs + 1}`,
      };
    }
    return null;
  }

  if (active < teamMax) {
    return {
      role: "MEMBER",
      phase: style === "RANGE" ? "optional" : "mandatory",
      index: active,
      total: teamMax,
      label: style === "RANGE" ? `Member ${active + 1} (optional)` : `Member ${active + 1}`,
    };
  }

  return null;
}

/** Slots the leader still needs to enter (excludes leader who is already on the team). */
export function remainingLeaderEntrySlots(event, team) {
  const { required: teamMin, teamMax, substitutes, style } = getRosterLimits(event);
  const mandatory = countMandatory(team);
  const active = activeMembers(team).length;
  const mandatoryRemaining = Math.max(0, teamMin - mandatory);

  if (style === "MEMBERS_SUBSTITUTES") {
    const subs = countSubstitutes(team);
    const substituteRemaining = Math.max(0, substitutes - subs);
    return {
      mandatoryRemaining,
      substituteRemaining,
      totalRemaining: mandatoryRemaining + substituteRemaining,
    };
  }

  const optionalRemaining = Math.max(0, teamMax - active);
  return {
    mandatoryRemaining,
    substituteRemaining: 0,
    totalRemaining: mandatoryRemaining + optionalRemaining,
  };
}

export function canLeaderEnterMembers(event) {
  return String(event?.member_registration_mode || "").toUpperCase() === "LEADER_MANAGED";
}

export function canInviteTeammatesLater(event) {
  return Boolean(event?.allow_team_invite_flow);
}

export function showTeammateChoice(event) {
  return canLeaderEnterMembers(event) || canInviteTeammatesLater(event);
}
