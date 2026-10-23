const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const out = path.join(__dirname, "../app/htf/_globals_source.css");
const css = execSync("git show origin/Hack-The-Future:app/globals.css", { encoding: "utf8" });
fs.writeFileSync(out, css, "utf8");
console.log("Wrote", out, css.length);
