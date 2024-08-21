import { assert } from "@std/assert";
import { isAsyncFunction as isAsyncFunction420 } from "jsr:@core/unknownutil@4.2.0/is/async-function";
import { isAsyncFunction } from "./async_function.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = async () => {};
const negative: unknown = () => {};

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => isAsyncFunction(positive)));
  },
  group: "isAsyncFunction (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !isAsyncFunction(negative)));
  },
  group: "isAsyncFunction (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => isAsyncFunction420(positive)));
  },
  group: "isAsyncFunction (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !isAsyncFunction420(negative)));
  },
  group: "isAsyncFunction (negative)",
});
