import { assert } from "@std/assert";
import { isUnknown as isUnknown420 } from "jsr:@core/unknownutil@4.2.0/is/unknown";
import { isUnknown } from "./unknown.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = "";

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => isUnknown(positive)));
  },
  group: "isUnknown (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => isUnknown420(positive)));
  },
  group: "isUnknown (positive)",
});
