import { assert } from "@std/assert";
import { isFunction as isFunction420 } from "jsr:@core/unknownutil@4.2.0/is/function";
import { isFunction } from "./function.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = () => {};
const negative: unknown = 0;

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => isFunction(positive)));
  },
  group: "isFunction (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !isFunction(negative)));
  },
  group: "isFunction (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => isFunction420(positive)));
  },
  group: "isFunction (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !isFunction420(negative)));
  },
  group: "isFunction (negative)",
});
