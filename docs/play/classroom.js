/* classroom.js — eight exercises for teaching the Weft-8.
 *
 * Every exercise has three things: a brief, a starter that is INCOMPLETE (so the
 * student runs it and sees what is missing), and checks that are machine-checked
 * against the real VM. An exercise whose starter already passes would teach
 * nothing, and the test suite asserts that it does not.
 *
 * The machine is the Loom's Weft-8 (docs/play/weft8.js, byte for byte).
 *
 * SPDX-FileCopyrightText: 2026 Dr Sohil Momin
 * SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./weft8.js"));
  else root.Classroom = factory(root.Weft8);
})(typeof self !== "undefined" ? self : this, function (Weft8) {
  "use strict";

  /* A check is declarative: which registers must hold what, and what must have
   * been written to the ports. The runner compares the machine's final state. */
  var EXERCISES = [
    {
      id: "one-number",
      title: "1 · Put a number somewhere",
      brief: "Put 42 in register R3. Remember: LDI fills R0, and MOV moves it.",
      hint: "LDI 42 puts 42 in R0. MOV R3, R0 copies it.",
      starter: [
        "; put 42 in R3",
        "        LDI 42",
        "; ... and now?",
        "        HLT"
      ].join("\n"),
      answer: [
        "; put 42 in R3",
        "        LDI 42",
        "        MOV R3, R0",
        "        HLT"
      ].join("\n"),
      check: { reg: { 3: 42 } }
    },
    {
      id: "add",
      title: "2 · Add two numbers",
      brief: "Put 5 in R1 and 7 in R2, then add them so R1 holds 12.",
      hint: "ADD R1, R2 means R1 = R1 + R2.",
      starter: [
        "        LDI 5",
        "        MOV R1, R0",
        "        LDI 7",
        "        MOV R2, R0",
        "; add them",
        "        HLT"
      ].join("\n"),
      answer: [
        "        LDI 5",
        "        MOV R1, R0",
        "        LDI 7",
        "        MOV R2, R0",
        "        ADD R1, R2",
        "        HLT"
      ].join("\n"),
      check: { reg: { 1: 12 } }
    },
    {
      id: "double",
      title: "3 · Double a number",
      brief: "R1 starts at 5. Make it 10 — without using ADD.",
      hint: "SHL shifts a register left by one bit, which doubles it.",
      starter: [
        "        LDI 5",
        "        MOV R1, R0",
        "; double it without ADD",
        "        HLT"
      ].join("\n"),
      answer: [
        "        LDI 5",
        "        MOV R1, R0",
        "        SHL R1",
        "        HLT"
      ].join("\n"),
      check: { reg: { 1: 10 } }
    },
    {
      id: "count",
      title: "4 · Count to ten",
      brief: "Make R2 end up holding 10, using a loop that adds one each time.",
      hint: "Count down in R1 from 10; JNZ jumps back while the result is not zero.",
      starter: [
        "        LDI 10",
        "        MOV R1, R0",
        "        LDI 0",
        "        MOV R2, R0",
        "loop:   ; add one to R2 here",
        "        HLT"
      ].join("\n"),
      answer: [
        "        LDI 10",
        "        MOV R1, R0",
        "        LDI 0",
        "        MOV R2, R0",
        "loop:   LDI 1",
        "        ADD R2, R0",
        "        LDI 1",
        "        MOV R5, R0",
        "        SUB R1, R5",
        "        JNZ loop",
        "        HLT"
      ].join("\n"),
      check: { reg: { 2: 10, 1: 0 } }
    },
    {
      id: "memory",
      title: "5 · Remember something",
      brief: "Store 42 in RAM at 0x80, clear the accumulator, then load it back.",
      hint: "STORE writes R0 to an address; LOAD reads an address into R0.",
      starter: [
        "        LDI 42",
        "        STORE 0x80",
        "        LDI 0",
        "; now load it back into R0",
        "        HLT"
      ].join("\n"),
      answer: [
        "        LDI 42",
        "        STORE 0x80",
        "        LDI 0",
        "        LOAD 0x80",
        "        HLT"
      ].join("\n"),
      check: { reg: { 0: 42 }, ram: { 0x80: 42 } }
    },
    {
      id: "subroutine",
      title: "6 · Call a subroutine",
      brief: "Write a subroutine that puts 7 in R4, call it, then put 9 in R3 and stop. If you do not come back, R3 is never set.",
      hint: "CALL pushes the return address; RET pops it. The subroutine ends with RET, not HLT — and the instructions after the CALL are what prove you came back.",
      starter: [
        "        CALL seven",
        "        ; ... and now? R3 must end up holding 9",
        "        HLT",
        "seven:  LDI 7",
        "        MOV R4, R0",
        "        ; how do you get back?"
      ].join("\n"),
      answer: [
        "        CALL seven",
        "        LDI 9",
        "        MOV R3, R0",
        "        HLT",
        "seven:  LDI 7",
        "        MOV R4, R0",
        "        RET"
      ].join("\n"),
      check: { reg: { 3: 9, 4: 7 }, halted: true }
    },
    {
      id: "branch",
      title: "7 · Decide something",
      brief: "R1 is 0. Set R3 to 1 when R1 is zero, and to 2 when it is not.",
      hint: "CMP sets the Z flag when two values are equal. JZ jumps when Z is set.",
      starter: [
        "        LDI 0",
        "        MOV R1, R0",
        "        LDI 0",
        "        MOV R2, R0",
        "        CMP R1, R2",
        "; which branch?",
        "        HLT",
        "zero:   LDI 1",
        "        MOV R3, R0",
        "        HLT",
        "other:  LDI 2",
        "        MOV R3, R0",
        "        HLT"
      ].join("\n"),
      answer: [
        "        LDI 0",
        "        MOV R1, R0",
        "        LDI 0",
        "        MOV R2, R0",
        "        CMP R1, R2",
        "        JZ  zero",
        "        JMP other",
        "zero:   LDI 1",
        "        MOV R3, R0",
        "        HLT",
        "other:  LDI 2",
        "        MOV R3, R0",
        "        HLT"
      ].join("\n"),
      check: { reg: { 3: 1 } }
    },
    {
      id: "port",
      title: "8 · Say something out loud",
      brief: "Write the letter A (65) to the NOTIFY port, then the letter B.",
      hint: "OUT NOTIFY hands R0 to the port. Do it twice.",
      starter: [
        "        LDI 65",
        "        OUT NOTIFY",
        "; and the second one?",
        "        HLT"
      ].join("\n"),
      answer: [
        "        LDI 65",
        "        OUT NOTIFY",
        "        LDI 66",
        "        OUT NOTIFY",
        "        HLT"
      ].join("\n"),
      check: { out: [65, 66] }
    },
    {
      id: "swap",
      title: "9 · Swap two registers",
      brief: "R1 holds 3 and R2 holds 8. Swap them, so R1 is 8 and R2 is 3 — without losing either.",
      hint: "You cannot swap in two moves. Copy one value to a third register first, then shuffle.",
      starter: [
        "        LDI 3",
        "        MOV R1, R0",
        "        LDI 8",
        "        MOV R2, R0",
        "; swap R1 and R2 without losing either",
        "        HLT"
      ].join("\n"),
      answer: [
        "        LDI 3",
        "        MOV R1, R0",
        "        LDI 8",
        "        MOV R2, R0",
        "        MOV R3, R1           ; keep R1 in R3",
        "        MOV R1, R2           ; R1 = old R2",
        "        MOV R2, R3           ; R2 = old R1",
        "        HLT"
      ].join("\n"),
      check: { reg: { 1: 8, 2: 3 } }
    }
  ];

  function exerciseById(id) {
    for (var i = 0; i < EXERCISES.length; i++) if (EXERCISES[i].id === id) return EXERCISES[i];
    return null;
  }

  /* run(source) -> { errors, vm, world-ish state, out } */
  function run(source, maxSteps) {
    var a = Weft8.assemble(source);
    if (a.errors.length) return { errors: a.errors, passed: false, why: "does not assemble" };
    var out = [];
    var host = { output: out, "in": function () { return 0; }, out: function (p, v) { out.push(v); } };
    var vm = new Weft8.VM({ rom: a.bytes, peripherals: host });
    vm.run(maxSteps === undefined ? 5000 : maxSteps);
    return { errors: [], vm: vm, out: out, steps: vm.steps, halted: vm.halted, error: vm.error, bytes: a.all };
  }

  /* check(exercise, source) -> { passed, failures: [what did not hold] } */
  function check(exercise, source) {
    var r = run(source);
    if (r.errors.length) {
      return { passed: false, failures: r.errors.map(function (e) {
        return (e.line ? "line " + e.line + ": " : "") + e.message;
      }), result: r };
    }
    var c = exercise.check || {};
    var failures = [];

    Object.keys(c.reg || {}).forEach(function (k) {
      if (r.vm.r[+k] !== c.reg[k]) failures.push("R" + k + " should be " + c.reg[k] + ", it is " + r.vm.r[+k]);
    });
    Object.keys(c.ram || {}).forEach(function (k) {
      if (r.vm.mem[+k] !== c.ram[k]) failures.push("memory at " + k + " should be " + c.ram[k] + ", it is " + r.vm.mem[+k]);
    });
    if (c.out && JSON.stringify(r.out) !== JSON.stringify(c.out)) {
      failures.push("the port should have received [" + c.out.join(", ") + "], it received [" + r.out.join(", ") + "]");
    }
    if (c.halted === true && !r.halted) failures.push("the machine did not reach HLT");
    if (r.error) failures.push("the machine stopped: " + r.error);

    return { passed: failures.length === 0, failures: failures, result: r };
  }

  return { EXERCISES: EXERCISES, exerciseById: exerciseById, run: run, check: check };
});
