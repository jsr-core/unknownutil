import { assert } from "@std/assert";
import { isNumber as isNumber420 } from "jsr:@core/unknownutil@4.2.0/is/number";
import { isNumber } from "./number.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = 0;
const negative: unknown = "";

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => isNumber(positive)));
  },
  group: "isNumber (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !isNumber(negative)));
  },
  group: "isNumber (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => isNumber420(positive)));
  },
  group: "isNumber (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !isNumber420(negative)));
  },
  group: "isNumber (negative)",
});
