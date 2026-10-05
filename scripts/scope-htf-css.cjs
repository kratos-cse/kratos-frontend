/**
 * Prefix PR HTF globals selectors with .htf-root (one-off build helper).
 */
const fs = require("fs");
const path = require("path");

const input = path.join(__dirname, "../app/htf/_globals_source.css");
const output = path.join(__dirname, "../app/htf/htf.css");

let css = fs.readFileSync(input, "utf8");
// Normalize line endings
css = css.replace(/\r\n/g, "\n");

// Drop global html/body rules — handled on .htf-root
css = css.replace(/^html\s*\{[^}]*\}\s*/m, "");
css = css.replace(/^body\s*\{([^}]*)\}/m, (_, inner) => `.htf-root {${inner}}\n`);

// Prefix top-level rules (not inside @media/@keyframes)
function prefixCss(source) {
  const out = [];
  let i = 0;
  while (i < source.length) {
    if (source[i] === "@") {
      const end = findBlockEnd(source, i);
      const block = source.slice(i, end);
      if (block.startsWith("@media") || block.startsWith("@supports")) {
        out.push(wrapMediaBlock(block));
      } else {
        out.push(block);
      }
      i = end;
      continue;
    }
    if (/^\s*\/\*/.test(source.slice(i))) {
      const end = source.indexOf("*/", i) + 2;
      out.push(source.slice(i, end));
      i = end;
      continue;
    }
    const trimmed = source.slice(i).trimStart();
    if (!trimmed || trimmed.startsWith("/*")) {
      i = source.length;
      break;
    }
    const ruleStart = i + (source.slice(i).length - trimmed.length);
    const end = findBlockEnd(source, ruleStart);
    const rule = source.slice(ruleStart, end).trim();
    if (rule) {
      out.push(prefixRule(rule));
    }
    i = end;
  }
  return out.join("\n");
}

function findBlockEnd(str, start) {
  const open = str.indexOf("{", start);
  if (open === -1) return str.length;
  let depth = 0;
  for (let j = open; j < str.length; j++) {
    if (str[j] === "{") depth++;
    if (str[j] === "}") {
      depth--;
      if (depth === 0) return j + 1;
    }
  }
  return str.length;
}

function prefixRule(rule) {
  const idx = rule.indexOf("{");
  if (idx === -1) return rule;
  const selectors = rule.slice(0, idx).trim();
  const body = rule.slice(idx);
  if (selectors.startsWith(".htf-root")) return rule;
  if (selectors === ":root") {
    return `.htf-root${body}`;
  }
  const parts = selectors.split(",").map((s) => {
    const sel = s.trim();
    if (!sel || sel.startsWith(".htf-root")) return sel;
    if (sel === "body") return ".htf-root";
    if (sel === "html") return ".htf-root";
    return `.htf-root ${sel}`;
  });
  return `${parts.join(", ")}${body}`;
}

function wrapMediaBlock(block) {
  const idx = block.indexOf("{");
  const header = block.slice(0, idx + 1);
  const inner = block.slice(idx + 1, block.lastIndexOf("}"));
  const closed = block.slice(block.lastIndexOf("}"));
  const prefixedInner = prefixCss(inner);
  return `${header}\n${prefixedInner}\n${closed}`;
}

const header = `/* Hack the Future 2.0 — scoped to /htf only */\n.htf-root { scroll-behavior: smooth; }\n`;
const body = prefixCss(css);
fs.writeFileSync(output, header + body, "utf8");
console.log("Wrote", output, body.length, "chars");
