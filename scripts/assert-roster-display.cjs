/**
 * Team composition display — keep in sync with lib/events/utils.js + eventCard.js
 * Run: node scripts/assert-roster-display.cjs
 */

const path = require("path");
const { pathToFileURL } = require("url");

function rosterStyle(rosterStyle, teamMin, teamMax, substituteCount) {
  const subs = Math.max(0, Number(substituteCount ?? 0));
  const s = String(rosterStyle || "").toUpperCase();
  if (s === "FIXED" || s === "RANGE" || s === "MEMBERS_SUBSTITUTES") {
    if ((s === "FIXED" || s === "RANGE") && subs > 0) return "MEMBERS_SUBSTITUTES";
    return s;
  }
  if (subs > 0) return "MEMBERS_SUBSTITUTES";
  const min = Number(teamMin ?? 1);
  const max = Number(teamMax ?? min);
  if (min === max) return "FIXED";
  return "RANGE";
}

function formatMembersSubstitutesLine(requiredCount, substituteCount = 0) {
  const req = Number(requiredCount);
  if (!Number.isFinite(req) || req < 1) return null;
  const subs = Math.max(0, Number(substituteCount ?? 0));
  const memberWord = req === 1 ? "member" : "members";
  let line = `${req} ${memberWord}`;
  if (subs > 0) {
    const subWord = subs === 1 ? "substitute" : "substitutes";
    line += ` + ${subs} ${subWord}`;
  }
  return line;
}

function formatRosterLabel(requiredCount, substituteCount, teamMin, teamMax, rosterStyleVal) {
  const min =
    teamMin != null && teamMin !== ""
      ? Number(teamMin)
      : requiredCount != null && requiredCount !== ""
        ? Number(requiredCount)
        : null;
  const max = teamMax != null && teamMax !== "" ? Number(teamMax) : min;
  if (min == null || Number.isNaN(min)) return null;
  const mx = max != null && !Number.isNaN(max) ? max : min;
  const subsRaw = substituteCount != null && substituteCount !== "" ? Number(substituteCount) : 0;
  const style = rosterStyle(rosterStyleVal, min, mx, subsRaw);
  const req =
    requiredCount != null && requiredCount !== ""
      ? Number(requiredCount)
      : min;
  const subs = style === "MEMBERS_SUBSTITUTES" ? Math.max(0, subsRaw) : 0;

  if (style === "MEMBERS_SUBSTITUTES") {
    return formatMembersSubstitutesLine(Math.max(1, req), subs);
  }
  if (min <= 1 && mx <= 1) return null;
  if (style === "RANGE" && mx > min) return `${min}–${mx} members`;
  if (style === "FIXED" || mx === min) return mx > 1 ? `${mx} members` : null;
  return req > 1 ? `${req} members` : null;
}

function formatRosterCardLine(event) {
  const mode = String(event?.registration_mode || "").toUpperCase();
  if (mode === "INDIVIDUAL_ONLY") return null;
  const roster = formatRosterLabel(
    event?.required_member_count,
    event?.substitute_count,
    event?.team_min_size,
    event?.team_max_size,
    event?.roster_style,
  );
  if (!roster) return null;
  const line = roster.toUpperCase();
  if (mode === "TEAM_ONLY") return `TEAM · ${line}`;
  return line;
}

const cases = [
  {
    name: "6 required + 1 sub (legacy RANGE style in API)",
    event: {
      registration_mode: "TEAM_ONLY",
      required_member_count: 6,
      substitute_count: 1,
      team_min_size: 6,
      team_max_size: 7,
      roster_style: "RANGE",
    },
    expect: "TEAM · 6 MEMBERS + 1 SUBSTITUTE",
  },
  {
    name: "5 required + 2 subs",
    event: {
      registration_mode: "TEAM_ONLY",
      required_member_count: 5,
      substitute_count: 2,
      team_min_size: 5,
      team_max_size: 7,
    },
    expect: "TEAM · 5 MEMBERS + 2 SUBSTITUTES",
  },
  {
    name: "6 required + 0 subs",
    event: {
      registration_mode: "TEAM_ONLY",
      required_member_count: 6,
      substitute_count: 0,
      team_min_size: 6,
      team_max_size: 6,
      roster_style: "FIXED",
    },
    expect: "TEAM · 6 MEMBERS",
  },
  {
    name: "1 required + 1 sub",
    event: {
      registration_mode: "TEAM_ONLY",
      required_member_count: 1,
      substitute_count: 1,
      team_min_size: 1,
      team_max_size: 2,
    },
    expect: "TEAM · 1 MEMBER + 1 SUBSTITUTE",
  },
  {
    name: "solo",
    event: { registration_mode: "INDIVIDUAL_ONLY" },
    expect: null,
  },
  {
    name: "true range 3-4",
    event: {
      registration_mode: "TEAM_ONLY",
      required_member_count: 3,
      substitute_count: 0,
      team_min_size: 3,
      team_max_size: 4,
      roster_style: "RANGE",
    },
    expect: "TEAM · 3–4 MEMBERS",
  },
];

let failed = 0;
for (const c of cases) {
  const got = formatRosterCardLine(c.event);
  if (got !== c.expect) {
    console.error(`FAIL ${c.name}: expected "${c.expect}", got "${got}"`);
    failed += 1;
  } else {
    console.log(`ok ${c.name}`);
  }
}

if (failed) {
  process.exit(1);
}
console.log("\nAll roster display cases passed.");
