/**
 * Public filter categories in lib/events/categories.js (not every backend enum value).
 * Run: node scripts/assert-event-categories.cjs
 */
const fs = require("fs");
const path = require("path");

const categoriesPath = path.join(__dirname, "..", "lib", "events", "categories.js");
const src = fs.readFileSync(categoriesPath, "utf8");

const requiredInFilters = ["TECHNICAL", "ONLINE", "TITLE_EVENT", "PROJECT_EXPO"];

const removedFromNav = ["PLAYGROUND", "SPARK"];

for (const key of requiredInFilters) {
  if (!src.includes(`"${key}"`)) {
    console.error(`Missing category ${key} in EVENT_CATEGORIES`);
    process.exit(1);
  }
}

for (const key of removedFromNav) {
  const filterMatch = src.match(/export const EVENT_CATEGORIES = \[([\s\S]*?)\];/);
  if (filterMatch && filterMatch[1].includes(`"${key}"`)) {
    console.error(`${key} should not be in EVENT_CATEGORIES (frontend nav/filters only)`);
    process.exit(1);
  }
  if (!src.includes(`${key}:`)) {
    console.error(`Keep ${key} in CATEGORY_LABELS for legacy API events`);
    process.exit(1);
  }
}

console.log("assert-event-categories: ok");
