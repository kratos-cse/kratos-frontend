/**
 * registration_mode → allowed types (fail closed when missing).
 * Run: node scripts/assert-registration-types.cjs
 */

function allowedRegistrationTypes(event) {
  const mode = String(event?.registration_mode || "").toUpperCase();
  if (!mode) {
    return { types: [], error: "This event has no registration mode configured." };
  }
  if (mode === "INDIVIDUAL_ONLY") {
    return { types: ["SOLO"], error: null };
  }
  if (mode === "TEAM_ONLY") {
    return { types: ["TEAM"], error: null };
  }
  if (mode === "TEAM_OR_INDIVIDUAL") {
    return { types: ["SOLO", "TEAM"], error: null };
  }
  return { types: [], error: `Unknown registration mode: ${mode}` };
}

const cases = [
  { event: { registration_mode: "INDIVIDUAL_ONLY" }, expect: ["SOLO"], error: null },
  { event: { registration_mode: "TEAM_ONLY" }, expect: ["TEAM"], error: null },
  { event: { registration_mode: "TEAM_OR_INDIVIDUAL" }, expect: ["SOLO", "TEAM"], error: null },
  { event: { team_min_size: 2, team_max_size: 5 }, expect: [], error: "configured" },
  { event: { registration_mode: "BOTH" }, expect: [], error: "Unknown" },
];

let failed = 0;
for (const c of cases) {
  const { types, error } = allowedRegistrationTypes(c.event);
  const typesOk = JSON.stringify(types) === JSON.stringify(c.expect);
  const errOk = c.error === null ? error === null : String(error || "").includes(c.error);
  if (!typesOk || !errOk) {
    console.error(`FAIL`, c, { types, error });
    failed += 1;
  } else {
    console.log(`ok`, c.event.registration_mode || "missing mode");
  }
}

if (failed) {
  process.exit(1);
}
console.log(`\nAll ${cases.length} registration type cases passed.`);
