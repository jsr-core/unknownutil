import { assert } from "@std/assert";
import { isMap as isMap420 } from "jsr:@core/unknownutil@4.2.0/is/map";
import { isMap } from "./map.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = new Map();
const negative: unknown = {};

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => isMap(positive)));
  },
  group: "isMap (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !isMap(negative)));
  },
  group: "isMap (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => isMap420(positive)));
  },
  group: "isMap (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !isMap420(negative)));
  },
  group: "isMap (negative)",
});
