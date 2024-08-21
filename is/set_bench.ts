import { assert } from "@std/assert";
import { isSet as isSet420 } from "jsr:@core/unknownutil@4.2.0/is/set";
import { isSet } from "./set.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = new Set();
const negative: unknown = [];

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => isSet(positive)));
  },
  group: "isSet (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !isSet(negative)));
  },
  group: "isSet (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => isSet420(positive)));
  },
  group: "isSet (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !isSet420(negative)));
  },
  group: "isSet (negative)",
});
