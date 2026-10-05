/**
 * Prefix PR HTF globals selectors with .htf-root (one-off build helper).
 */
const fs = require("fs");
const path = require("path");

const input = path.join(__dirname, "../app/htf/_globals_source.css");
const output = path.join(__dirname, "../app/htf/htf.css");

let css = fs.readFileSync(input, "utf8");
css = css.replace(/\r\n/g, "\n");

css = css.replace(/^html\s*\{[^}]*\}\s*/m, "");
css = css.replace(/^body\s*\{([^}]*)\}/m, (_, inner) => `.htf-root {${inner}}\n`);
css = css.replace(/^:root\s*\{([^}]*)\}/m, (_, inner) => `.htf-root {${inner}}\n`);

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
  if (selectors.startsWith("@")) return rule;
  if (selectors.startsWith(".htf-root")) return rule;
  const parts = selectors.split(",").map((s) => {
    const sel = s.trim();
    if (!sel || sel.startsWith(".htf-root")) return sel;
    if (sel === "body" || sel === "html") return ".htf-root";
    return `.htf-root ${sel}`;
  });
  return `${parts.join(", ")}${body}`;
}

function prefixCss(source) {
  const out = [];
  let i = 0;
  while (i < source.length) {
    const rest = source.slice(i);
    const ws = rest.length - rest.trimStart().length;
    i += ws;
    if (i >= source.length) break;

    if (source[i] === "@") {
      const end = findBlockEnd(source, i);
      const block = source.slice(i, end);
      if (block.startsWith("@media") || block.startsWith("@supports")) {
        const innerStart = block.indexOf("{") + 1;
        const innerEnd = block.lastIndexOf("}");
        const header = block.slice(0, innerStart);
        const inner = block.slice(innerStart, innerEnd);
        const footer = block.slice(innerEnd);
        out.push(`${header}\n${prefixCss(inner)}\n${footer}`);
      } else {
        out.push(block);
      }
      i = end;
      continue;
    }

    if (source.slice(i, i + 2) === "/*") {
      const end = source.indexOf("*/", i) + 2;
      out.push(source.slice(i, end));
      i = end;
      continue;
    }

    const end = findBlockEnd(source, i);
    const rule = source.slice(i, end).trim();
    if (rule) out.push(prefixRule(rule));
    i = end;
  }
  return out.join("\n");
}

const header = `/* Hack the Future 2.0 — scoped to /htf only */\n.htf-root { scroll-behavior: smooth; }\n`;
let body = prefixCss(css);

body = body.replace(/\.htf-root @media/g, "@media");
body = body.replace(/\.htf-root @keyframes/g, "@keyframes");

fs.writeFileSync(output, header + body, "utf8");
console.log("Wrote", output);
