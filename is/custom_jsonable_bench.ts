import { assert } from "@std/assert";
import { isCustomJsonable } from "./custom_jsonable.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = { toJSON: () => "custom" };
const negative: unknown = {};

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => isCustomJsonable(positive)));
  },
  group: "isCustomJsonable (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !isCustomJsonable(negative)));
  },
  group: "isCustomJsonable (negative)",
});
