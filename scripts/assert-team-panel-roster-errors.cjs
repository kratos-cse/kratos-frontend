/**
 * TeamPanel roster add failure UX — static checks on TeamPanel.js
 * Run: node scripts/assert-team-panel-roster-errors.cjs
 */
const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(
  path.join(__dirname, "..", "components", "team", "TeamPanel.js"),
  "utf8",
);

if (!src.includes("toUserMessage(err)")) {
  console.error("TeamPanel must map roster errors with toUserMessage");
  process.exit(1);
}

const onAddRosterMatch = src.match(/async function onAddRoster[\s\S]*?^  \}/m);
if (!onAddRosterMatch) {
  console.error("Could not find onAddRoster in TeamPanel.js");
  process.exit(1);
}
const onAddRoster = onAddRosterMatch[0];

if (!onAddRoster.includes("setBusy(true)")) {
  console.error("onAddRoster must guard in-flight requests with busy");
  process.exit(1);
}

if (!onAddRoster.match(/setForm\(EMPTY_FORM\)[\s\S]*?await refresh/)) {
  console.error("onAddRoster must clear form only on success before refresh");
  process.exit(1);
}

const catchBlock = onAddRoster.split("} catch (err) {")[1];
if (!catchBlock || catchBlock.includes("setForm(EMPTY_FORM)")) {
  console.error("onAddRoster catch must not clear form on failure");
  process.exit(1);
}

if (!onAddRoster.includes("setError(toUserMessage(err))")) {
  console.error("onAddRoster catch must set participant-facing error banner");
  process.exit(1);
}

console.log("assert-team-panel-roster-errors: ok");
