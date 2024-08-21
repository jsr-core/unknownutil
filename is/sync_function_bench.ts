import { assert } from "@std/assert";
import { isSyncFunction as isSyncFunction420 } from "jsr:@core/unknownutil@4.2.0/is/sync-function";
import { isSyncFunction } from "./sync_function.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = () => {};
const negative: unknown = async () => {};

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => isSyncFunction(positive)));
  },
  group: "isSyncFunction (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !isSyncFunction(negative)));
  },
  group: "isSyncFunction (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => isSyncFunction420(positive)));
  },
  group: "isSyncFunction (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !isSyncFunction420(negative)));
  },
  group: "isSyncFunction (negative)",
});
