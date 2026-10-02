/**
 * Roster registration UX (leader-managed) — keep in sync with lib/events/rosterPlan.js
 * Run: node scripts/assert-roster-plan.cjs
 */

function rosterStyle(event) {
  const s = event?.roster_style;
  if (s === "FIXED" || s === "RANGE" || s === "MEMBERS_SUBSTITUTES") return s;
  const teamMin = Math.max(1, Number(event?.team_min_size ?? event?.required_member_count ?? 1));
  const teamMax = Math.max(teamMin, Number(event?.team_max_size ?? teamMin));
  if (teamMin === teamMax) return "FIXED";
  return "RANGE";
}

function getRosterLimits(event) {
  const teamMin = Math.max(1, Number(event?.team_min_size ?? event?.required_member_count ?? 1));
  const teamMax = Math.max(
    teamMin,
    Number(event?.team_max_size ?? event?.required_member_count ?? teamMin),
  );
  const style = rosterStyle(event);
  const substitutes =
    style === "MEMBERS_SUBSTITUTES" ? Math.max(0, Number(event?.substitute_count ?? 0)) : 0;
  return { required: teamMin, teamMax, substitutes, style };
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
  const { required, teamMax, substitutes, style } = getRosterLimits(event);
  const mandatory = countMandatory(team);
  const active = activeMembers(team).length;

  if (mandatory < required) {
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

console.log("assert-roster-plan: ok");
