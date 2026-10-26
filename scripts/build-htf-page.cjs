const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

let s = execSync("git show origin/Hack-The-Future:app/page.js", { encoding: "utf8" });
s = s.replace(/from "\.\/components\//g, 'from "@/components/htf/');
s = s.replace(
  "@/components/LiquidEther/LiquidEther",
  "@/components/htf/LiquidEther/LiquidEther"
);
s = s.replace(
  'const REGISTER_LINK = "/login?mode=register";',
  'import { HTF_REGISTRATION_URL } from "@/lib/links";'
);
s = s.replace(/REGISTER_LINK/g, "HTF_REGISTRATION_URL");
s = s.replace(
  "submission through the dashboard.",
  "submission when organizers share instructions."
);
s = s.replace(
  /<a href=\{HTF_REGISTRATION_URL\} className="btn-neon">/g,
  '<a href={HTF_REGISTRATION_URL} target="_blank" rel="noopener noreferrer" className="btn-neon">'
);
s = `'use client';\n\n${s}`;

const out = path.join(__dirname, "../app/htf/page.js");
fs.writeFileSync(out, s, "utf8");
console.log("Wrote", out);
