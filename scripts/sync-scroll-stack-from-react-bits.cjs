/**
 * Copies ScrollStack sources from the local react-bits repo for diff/reconcile.
 * HTF uses components/htf/ScrollStack/HtfScrollStack.* (window scroll, no Lenis).
 *
 * Usage: node scripts/sync-scroll-stack-from-react-bits.cjs
 */
const fs = require("fs");
const path = require("path");

const REACT_BITS = path.resolve(__dirname, "../../react-bits");
const srcJsx = path.join(
  REACT_BITS,
  "src/content/Components/ScrollStack/ScrollStack.jsx"
);
const srcCss = path.join(
  REACT_BITS,
  "src/content/Components/ScrollStack/ScrollStack.css"
);
const outDir = path.resolve(__dirname, "../components/htf/ScrollStack/_react-bits-upstream");

if (!fs.existsSync(srcJsx)) {
  console.error("react-bits ScrollStack not found at:", srcJsx);
  console.error("Expected repo at:", REACT_BITS);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
fs.copyFileSync(srcJsx, path.join(outDir, "ScrollStack.jsx"));
fs.copyFileSync(srcCss, path.join(outDir, "ScrollStack.css"));
console.log("Synced upstream ScrollStack to", outDir);
console.log("Merge changes into HtfScrollStack.js / HtfScrollStack.css as needed.");
