import { assert } from "@std/assert";
import { isUndefined as isUndefined420 } from "jsr:@core/unknownutil@4.2.0/is/undefined";
import { isUndefined } from "./undefined.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = undefined;
const negative: unknown = 0;

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => isUndefined(positive)));
  },
  group: "isUndefined (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !isUndefined(negative)));
  },
  group: "isUndefined (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => isUndefined420(positive)));
  },
  group: "isUndefined (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !isUndefined420(negative)));
  },
  group: "isUndefined (negative)",
});
