/* test-node.js — the proof for Weft-8 Classroom.
 *
 * The teaching claim is: every exercise is solvable, its starter is genuinely
 * incomplete, and the checks are strict enough to catch a wrong answer. All three
 * are asserted here, on the real machine.
 *
 * SPDX-FileCopyrightText: 2026 Dr Sohil Momin
 * SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
 */
"use strict";

const W = require("./docs/play/weft8.js");
const C = require("./docs/play/classroom.js");

let pass = 0;
const failures = [];
const ok = (c, n) => { if (c) { pass++; return; } failures.push(n); console.log("  FAIL  " + n); };
const eq = (g, w, n) => ok(JSON.stringify(g) === JSON.stringify(w),
  n + "  (got " + JSON.stringify(g) + ", want " + JSON.stringify(w) + ")");

console.log("the machine — the Loom's Weft-8, unchanged");
eq(Object.keys(W.OPCODES).length, 27, "27 opcodes");
eq(W.assemble("LDI 1\nHLT").all, [0x00, 0x01, 0x1A, 0x00], "two bytes per instruction, opcode first");

console.log("the exercises — the answer works, the starter does not");
eq(C.EXERCISES.length, 9, "nine exercises ship");
C.EXERCISES.forEach(function (ex) {
  ok(ex.brief.length > 30, ex.id + ": has a brief worth reading");
  ok(ex.hint.length > 10, ex.id + ": has a hint");
  ok(ex.check && (ex.check.reg || ex.check.ram || ex.check.out), ex.id + ": has at least one machine check");

  const a = C.check(ex, ex.answer);
  ok(a.passed, ex.id + ": the answer passes its own checks" + (a.passed ? "" : " — " + a.failures.join("; ")));

  const s = C.check(ex, ex.starter);
  ok(!s.passed, ex.id + ": the starter FAILS, so there is something to do");

  const bytes = W.assemble(ex.answer);
  eq(bytes.errors, [], ex.id + ": the answer assembles");
  ok(bytes.all.length <= 128, ex.id + ": the answer fits the 128-byte ROM");
});

console.log("the checks bite — a wrong answer is caught");
{
  const ex = C.exerciseById("add");
  const wrong = C.check(ex, "LDI 5\nMOV R1, R0\nLDI 7\nMOV R2, R0\nSUB R1, R2\nHLT");
  ok(!wrong.passed, "subtracting instead of adding is caught");
  ok(/R1 should be 12/.test(wrong.failures.join(" ")), "and the message says what was expected: " + wrong.failures[0]);
}
{
  const ex = C.exerciseById("memory");
  const forgot = C.check(ex, "LDI 42\nSTORE 0x80\nLDI 0\nHLT");
  ok(!forgot.passed, "forgetting to LOAD back is caught");
}
{
  const ex = C.exerciseById("subroutine");
  const noRet = C.check(ex, "CALL seven\nLDI 9\nMOV R3, R0\nHLT\nseven: LDI 7\nMOV R4, R0\nHLT");
  ok(!noRet.passed, "a subroutine that ends in HLT instead of RET does not pass");
}
{
  const ex = C.exerciseById("port");
  const once = C.check(ex, "LDI 65\nOUT NOTIFY\nHLT");
  ok(!once.passed, "writing one byte when two were asked for is caught");
}
{
  const ex = C.exerciseById("branch");
  const wrongBranch = C.check(ex, "LDI 0\nMOV R1, R0\nLDI 0\nMOV R2, R0\nLDI 2\nMOV R3, R0\nHLT");
  ok(!wrongBranch.passed, "taking the 'not zero' branch when R1 IS zero is caught");
  ok(/R3 should be 1/.test(wrongBranch.failures.join(" ")), "and the message names the register and the value");
}

console.log("the page — it loads what it needs");
const fs = require("fs");
const html = fs.readFileSync("./docs/play/index.html", "utf8");
["web-kit.js", "weft8.js", "classroom.js"].forEach(function (k) {
  ok(html.indexOf('<script src="' + k + '"></script>') > 0, "the page loads " + k);
});
ok(html.indexOf('id="exercises"') > 0, "the page has the exercise list");
ok(html.indexOf('id="check"') > 0, "the page has a Check button");
ok(fs.existsSync("./TEACHER.md"), "a teacher's sheet ships with it");


/* the family — every page links back to the Loom, and the Loom to every page */
{
  const fsm = require("fs");
  const landing = fsm.readFileSync("./docs/index.html", "utf8");
  ok(landing.indexOf('id="family"') > 0, "the landing page carries the family strip");
  ok(landing.indexOf("you are here") > 0, "and marks this page as the one you are on");
  ['app-jacquard', 'app-weft-puzzles', 'app-clip-loom', 'weft8-hardware', 'weft8-kit', 'weft8-compare'].forEach(function (slug) {
    ok(landing.indexOf("https://drsamonline.github.io/" + slug + "/") > 0, "it links to " + slug);
  });
  const readme = fsm.readFileSync("./README.md", "utf8");
  ok(readme.indexOf("The Weft-8 family") > 0, "the README carries the family table too");
  ok(readme.indexOf("you are here") > 0, "and marks this repository in it");
}

console.log("");
console.log(pass + " passed, " + failures.length + " failed");
if (failures.length) { failures.forEach(f => console.log("  - " + f)); process.exit(1); }
