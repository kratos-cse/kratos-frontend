/**
 * Roster registration UX (leader-managed) — keep in sync with lib/events/rosterPlan.js
 * Run: node scripts/assert-roster-plan.cjs
 */

function rosterStyle(event) {
  const subs = Math.max(0, Number(event?.substitute_count ?? 0));
  const s = event?.roster_style;
  if (s === "FIXED" || s === "RANGE" || s === "MEMBERS_SUBSTITUTES") {
    if ((s === "FIXED" || s === "RANGE") && subs > 0) return "MEMBERS_SUBSTITUTES";
    return s;
  }
  if (subs > 0) return "MEMBERS_SUBSTITUTES";
  const teamMin = Math.max(1, Number(event?.team_min_size ?? event?.required_member_count ?? 1));
  const teamMax = Math.max(teamMin, Number(event?.team_max_size ?? teamMin));
  if (teamMin === teamMax) return "FIXED";
  return "RANGE";
}

function getRosterLimits(event) {
  const teamMin = Math.max(1, Number(event?.team_min_size ?? event?.required_member_count ?? 1));
  const teamMax = Math.max(teamMin, Number(event?.team_max_size ?? teamMin));
  const style = rosterStyle(event);
  const substitutes =
    style === "MEMBERS_SUBSTITUTES" ? Math.max(0, Number(event?.substitute_count ?? 0)) : 0;
  return {
    required: teamMin,
    teamMax: style === "MEMBERS_SUBSTITUTES" ? teamMin + substitutes : teamMax,
    substitutes,
    style,
  };
}

function activeMembers(team) {
  return (team?.members || []).filter(
    (m) => !["LEFT", "REMOVED"].includes(String(m.status).toUpperCase()),
  );
}

function countMandatory(team) {
  return activeMembers(team).filter((m) => {
    const role = String(m.role).toUpperCase();
    return role === "LEADER" || role === "MEMBER";
  }).length;
}

function countSubstitutes(team) {
  return activeMembers(team).filter((m) => String(m.role).toUpperCase() === "SUBSTITUTE").length;
}

function getNextRosterSlot(event, team) {
  const { required: teamMin, teamMax, substitutes, style } = getRosterLimits(event);
  const mandatory = countMandatory(team);
  const active = activeMembers(team).length;

  if (mandatory < teamMin) {
    return { role: "MEMBER", phase: "mandatory" };
  }
  if (style === "MEMBERS_SUBSTITUTES") {
    const subs = countSubstitutes(team);
    if (subs < substitutes && active < teamMax) return { role: "SUBSTITUTE", phase: "substitute" };
    return null;
  }
  if (active < teamMax) return { role: "MEMBER", phase: style === "RANGE" ? "optional" : "mandatory" };
  return null;
}

const rangeEvent = {
  roster_style: "RANGE",
  team_min_size: 3,
  team_max_size: 4,
  substitute_count: 0,
  required_member_count: 3,
};

const team3 = {
  members: [
    { role: "LEADER", status: "ACTIVE" },
    { role: "MEMBER", status: "ACTIVE" },
    { role: "MEMBER", status: "ACTIVE" },
  ],
};

const team4 = {
  members: [
    ...team3.members,
    { role: "MEMBER", status: "ACTIVE" },
  ],
};

const limits = getRosterLimits(rangeEvent);
if (limits.substitutes !== 0) {
  console.error("RANGE 3-4: substitutes should be 0, got", limits.substitutes);
  process.exit(1);
}

const slot3 = getNextRosterSlot(rangeEvent, team3);
if (!slot3 || slot3.role !== "MEMBER" || slot3.phase !== "optional") {
  console.error("RANGE 3/4 filled: expected optional MEMBER slot, got", slot3);
  process.exit(1);
}

const slot4 = getNextRosterSlot(rangeEvent, team4);
if (slot4 !== null) {
  console.error("RANGE 4/4 filled: expected null, got", slot4);
  process.exit(1);
}

const subsEvent = {
  roster_style: "MEMBERS_SUBSTITUTES",
  team_min_size: 5,
  team_max_size: 7,
  substitute_count: 2,
  required_member_count: 5,
};

const team5mand = {
  members: [
    { role: "LEADER", status: "ACTIVE" },
    ...Array.from({ length: 4 }, () => ({ role: "MEMBER", status: "ACTIVE" })),
  ],
};

const subSlot = getNextRosterSlot(subsEvent, team5mand);
if (!subSlot || subSlot.role !== "SUBSTITUTE") {
  console.error("5+2: expected SUBSTITUTE slot after mandatory full, got", subSlot);
  process.exit(1);
}

// RANGE 3–5: fourth and fifth optional, not sixth
const range35 = {
  roster_style: "RANGE",
  team_min_size: 3,
  team_max_size: 5,
  substitute_count: 0,
  required_member_count: 3,
};
const team4of5 = {
  members: [
    { role: "LEADER", status: "ACTIVE" },
    ...Array.from({ length: 3 }, () => ({ role: "MEMBER", status: "ACTIVE" })),
  ],
};
const slot5th = getNextRosterSlot(range35, team4of5);
if (!slot5th || slot5th.phase !== "optional") {
  console.error("RANGE 3-5 at 4/5: expected optional 5th slot, got", slot5th);
  process.exit(1);
}
const team5full = {
  members: [
    { role: "LEADER", status: "ACTIVE" },
    ...Array.from({ length: 4 }, () => ({ role: "MEMBER", status: "ACTIVE" })),
  ],
};
if (getNextRosterSlot(range35, team5full) !== null) {
  console.error("RANGE 3-5 at 5/5: expected full roster");
  process.exit(1);
}

// Missing team_max_size must not collapse to required_member_count (would cap at 3 incorrectly)
const missingMax = {
  roster_style: "RANGE",
  team_min_size: 3,
  required_member_count: 3,
};
const limitsMissing = getRosterLimits(missingMax);
if (limitsMissing.teamMax !== 3) {
  console.error("missing team_max: expected max=teamMin=3, got", limitsMissing.teamMax);
  process.exit(1);
}
const withMax = { ...missingMax, team_max_size: 4 };
if (getNextRosterSlot(withMax, team3) === null) {
  console.error("RANGE with team_max_size=4: expected optional slot at 3 members");
  process.exit(1);
}

// FIXED size 3 stops at three
const fixed3 = {
  roster_style: "FIXED",
  team_min_size: 3,
  team_max_size: 3,
  required_member_count: 3,
  substitute_count: 0,
};
if (getNextRosterSlot(fixed3, team3) !== null) {
  console.error("FIXED 3: expected full at 3 members");
  process.exit(1);
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function coalesceRosterEvent(event, team) {
  if (!event) return null;
  if (!team) return event;
  const merged = { ...event };
  if (typeof team.roster_style === "string" && team.roster_style.trim()) {
    merged.roster_style = team.roster_style.trim();
  }
  if (isFiniteNumber(team.team_max_size)) merged.team_max_size = team.team_max_size;
  if (isFiniteNumber(team.required_member_count)) {
    merged.required_member_count = team.required_member_count;
    if (!isFiniteNumber(event.team_min_size)) merged.team_min_size = team.required_member_count;
  }
  if (isFiniteNumber(team.team_min_size)) merged.team_min_size = team.team_min_size;
  if (isFiniteNumber(team.substitute_count)) merged.substitute_count = team.substitute_count;
  return merged;
}

const sparseEvent = { team_min_size: 3, required_member_count: 3 };
const teamPayload = { team_max_size: 4, required_member_count: 3, substitute_count: 0, roster_style: "RANGE" };
const merged = coalesceRosterEvent(sparseEvent, teamPayload);
if (merged.team_max_size !== 4 || getNextRosterSlot(merged, team3) === null) {
  console.error("coalesce: expected team_max_size from team and optional 4th slot");
  process.exit(1);
}

const partialTeam = { team_max_size: 4 };
const mergedPartial = coalesceRosterEvent({ ...rangeEvent, team_max_size: 99 }, partialTeam);
if (mergedPartial.team_max_size !== 4 || mergedPartial.roster_style !== "RANGE") {
  console.error("coalesce: should override only team_max_size, keep event roster_style");
  process.exit(1);
}

const noOverride = coalesceRosterEvent(rangeEvent, {});
if (noOverride.team_max_size !== 4) {
  console.error("coalesce: empty team should leave event unchanged");
  process.exit(1);
}

console.log("assert-roster-plan: ok");
