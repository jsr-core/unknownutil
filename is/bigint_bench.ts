import { assert } from "@std/assert";
import { isBigint as isBigint420 } from "jsr:@core/unknownutil@4.2.0/is/bigint";
import { isBigint } from "./bigint.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = 0n;
const negative: unknown = 0;

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => isBigint(positive)));
  },
  group: "isBigint (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !isBigint(negative)));
  },
  group: "isBigint (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => isBigint420(positive)));
  },
  group: "isBigint (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !isBigint420(negative)));
  },
  group: "isBigint (negative)",
});
