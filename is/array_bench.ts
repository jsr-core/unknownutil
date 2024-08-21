import { assert } from "@std/assert";
import { isArray as isArray420 } from "jsr:@core/unknownutil@4.2.0/is/array";
import { isArray } from "./array.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = [];
const negative: unknown = "";

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => isArray(positive)));
  },
  group: "isArray (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !isArray(negative)));
  },
  group: "isArray (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => isArray420(positive)));
  },
  group: "isArray (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !isArray420(negative)));
  },
  group: "isArray (negative)",
});
