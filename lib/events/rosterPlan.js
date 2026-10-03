/** Roster slot planning from event + team state (mirrors backend roster_limits / next_join_role). */

import { resolveRosterStyle } from "./utils";

function rosterStyle(event) {
  const teamMin = Math.max(1, Number(event?.team_min_size ?? event?.required_member_count ?? 1));
  const teamMax = Math.max(teamMin, Number(event?.team_max_size ?? teamMin));
  return resolveRosterStyle(event?.roster_style, teamMin, teamMax, event?.substitute_count);
}

export function getRosterLimits(event) {
  const required = Math.max(1, Number(event?.required_member_count ?? event?.team_min_size ?? 1));
  const teamMin = Math.max(1, Number(event?.team_min_size ?? required));
  const teamMax = Math.max(teamMin, Number(event?.team_max_size ?? required));
  const style = rosterStyle(event);
  const substitutes =
    style === "MEMBERS_SUBSTITUTES" ? Math.max(0, Number(event?.substitute_count ?? 0)) : 0;
  return {
    required,
    teamMax: style === "MEMBERS_SUBSTITUTES" ? required + substitutes : teamMax,
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
  const { required, teamMax, substitutes, style } = getRosterLimits(event);
  const mandatory = countMandatory(team);
  const active = activeMembers(team).length;

  if (mandatory < required) {
    return {
      role: "MEMBER",
      phase: "mandatory",
      index: mandatory,
      total: required,
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
  const { required, teamMax, substitutes, style } = getRosterLimits(event);
  const mandatory = countMandatory(team);
  const active = activeMembers(team).length;
  const mandatoryRemaining = Math.max(0, required - mandatory);

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
