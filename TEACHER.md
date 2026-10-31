# Teacher's sheet — Weft-8 Classroom

Eight exercises, one machine, about 45–60 minutes for a first lesson. Everything runs offline in a
browser from `docs/index.html`; nothing needs installing and nothing is sent anywhere.

## Before the lesson

Open the page. The left column lists the eight exercises, the middle is the student's editor, the right
shows the machine after it runs. **Every starter is deliberately incomplete** — running it does something,
but not the right thing. That is the point: the student sees the machine obey before they see it do the
task.

## The eight exercises

| # | Exercise | What it teaches | The answer, in words |
|---|---|---|---|
| 1 | Put a number somewhere | `LDI` fills the accumulator, `MOV` moves it | `LDI 42` then `MOV R3, R0` |
| 2 | Add two numbers | `ADD Ra, Rb` means `Ra = Ra + Rb` | load both, then `ADD R1, R2` |
| 3 | Double a number | `SHL` is multiply-by-two | `SHL R1` |
| 4 | Count to ten | a loop needs a counter, a decrement and a conditional jump | `SUB` the counter, `JNZ` back to the top |
| 5 | Remember something | `STORE` and `LOAD` reach RAM at `0x80` | store 42, clear `R0`, `LOAD 0x80` |
| 6 | Call a subroutine | `CALL` pushes the return address, `RET` pops it | end the subroutine with `RET`, and set `R3` after the call to prove you came back |
| 7 | Decide something | `CMP` sets the flags; `JZ` branches on zero | `CMP R1, R2` then `JZ zero` |
| 8 | Say something out loud | `OUT` hands a byte to a port | `LDI 65` / `OUT NOTIFY`, twice |

The full answers are also in `docs/play/classroom.js` (the `answer` field of each exercise) and can be
printed with:

```
node -e "require('./docs/play/classroom.js').EXERCISES.forEach(e => console.log(e.title + '\n' + e.answer + '\n'))"
```

## Three things worth saying out loud in class

1. **There is no `if`.** The machine only jumps when a flag is set. An `if` is something *you* build, and
   the student builds one in exercise 7.
2. **A register is not a variable.** There are sixteen of them and they are shared by everything; that is
   why the accumulator (`R0`) is used so much.
3. **The flags are the memory of the last comparison.** `CMP` stores nothing — it only sets Z, C, N and V.

## Common mistakes, and what they look like on screen

| What the student wrote | What the machine says | What to ask them |
|---|---|---|
| `LDI 42` then `HLT` (exercise 1) | "R3 should be 42, it is 0" | where did the 42 go? which register did `LDI` fill? |
| `ADD R1, R1` (exercise 2) | "R1 should be 12, it is 10" | what does the second operand mean? |
| loop with no `SUB` (exercise 4) | "step limit reached" | what makes the loop stop? |
| `HLT` instead of `RET` (exercise 6) | "R3 should be 9, it is 0" | did you come back? what proves it? |
| one `OUT` instead of two (exercise 8) | "the port should have received [65, 66]" | how many bytes did the task ask for? |

## Marking

The page ticks an exercise when the machine agrees — there is no partial credit, because the machine has
no partial answers. If a student's program passes, it is right; if it does not, the message names the
register and the value that was expected, which is the feedback you would give anyway.

## After the lesson

`weft8-kit` and `app-jacquard` use the same machine, so a student who finishes these eight can open
Jacquard and see the reference card, or the puzzle set in `app-weft-puzzles`, without learning a new
computer.
