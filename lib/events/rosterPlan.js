/** Roster slot planning from event + team state (mirrors backend roster_limits). */

export function getRosterLimits(event) {
  const required = Number(event?.required_member_count ?? event?.team_min_size ?? 1);
  const maxSize = Number(event?.team_max_size ?? required);
  const subs =
    event?.substitute_count != null
      ? Number(event.substitute_count)
      : Math.max(0, maxSize - required);
  return {
    required: Math.max(1, required),
    substitutes: Math.max(0, subs),
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
 * @returns {{ role: 'MEMBER' | 'SUBSTITUTE', phase: 'mandatory' | 'substitute', index: number, total: number, label: string } | null}
 */
export function getNextRosterSlot(event, team) {
  const { required, substitutes } = getRosterLimits(event);
  const mandatory = countMandatory(team);
  const subs = countSubstitutes(team);

  if (mandatory < required) {
    return {
      role: "MEMBER",
      phase: "mandatory",
      index: mandatory,
      total: required,
      label: `Member ${mandatory + 1}`,
    };
  }

  if (subs < substitutes) {
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

/** Slots the leader still needs to enter (excludes leader who is already on the team). */
export function remainingLeaderEntrySlots(event, team) {
  const { required, substitutes } = getRosterLimits(event);
  const mandatory = countMandatory(team);
  const subs = countSubstitutes(team);
  const mandatoryRemaining = Math.max(0, required - mandatory);
  const substituteRemaining = Math.max(0, substitutes - subs);
  return { mandatoryRemaining, substituteRemaining, totalRemaining: mandatoryRemaining + substituteRemaining };
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
