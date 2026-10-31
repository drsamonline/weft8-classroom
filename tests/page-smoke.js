/* tests/page-smoke.js — the classroom page, driven. jsdom is test-only.
 * SPDX-FileCopyrightText: 2026 Dr Sohil Momin · PolyForm-Noncommercial-1.0.0 */
"use strict";
const fs = require("fs"), path = require("path");
let JSDOM;
try { ({ JSDOM } = require("jsdom")); } catch (e) { console.log("jsdom missing — npm install"); process.exit(2); }
const dir = path.join(__dirname, "..", "docs", "play");
let html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
for (const k of ["web-kit.js", "weft8.js", "classroom.js"])
  html = html.replace('<script src="' + k + '"></script>', "<script>" + fs.readFileSync(path.join(dir, k), "utf8") + "</script>");
const errors = [];
const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true,
  beforeParse(w) { w.addEventListener("error", (e) => errors.push(e.message)); } });
const w = dom.window, d = w.document;
let pass = 0, fail = 0;
const ok = (n, c, x) => { if (c) { pass++; console.log("PASS  " + n); } else { fail++; console.log("FAIL  " + n + (x ? "  [" + x + "]" : "")); } };
const click = (id) => d.getElementById(id).dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
const t = (id) => d.getElementById(id).textContent;

ok("the page boots without an error", errors.length === 0, errors.join("; "));
ok("nine exercises are listed", d.querySelectorAll("#exercises button").length === 9);
ok("the first starter is loaded", /LDI 42/.test(d.getElementById("src").value));
ok("sixteen registers are drawn", d.querySelectorAll("#regs .reg").length === 16);

/* the starter must not pass */
click("check");
ok("the incomplete starter is refused", /Not yet/.test(t("result")), t("result").slice(0, 60));
ok("and the refusal names the register", /R3 should be 42/.test(t("result")), t("result").slice(0, 90));

/* the right answer must pass */
d.getElementById("src").value = "LDI 42\nMOV R3, R0\nHLT";
click("check");
ok("the correct answer passes", /Correct/.test(t("result")), t("result").slice(0, 60));
ok("the exercise gets a tick", d.querySelectorAll("#exercises .tick").length === 1);

/* a wrong answer to another exercise */
d.querySelectorAll("#exercises button")[1].dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
d.getElementById("src").value = "LDI 5\nMOV R1, R0\nLDI 7\nMOV R2, R0\nSUB R1, R2\nHLT";
click("check");
ok("subtracting instead of adding is refused", /R1 should be 12/.test(t("result")), t("result").slice(0, 90));

/* reset restores the starter */
click("reset");
ok("reset restores the starter", /LDI 5/.test(d.getElementById("src").value));

console.log("");
console.log(pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
