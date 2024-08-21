import { assert } from "@std/assert";
import { isNull as isNull420 } from "jsr:@core/unknownutil@4.2.0/is/null";
import { isNull } from "./null.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = null;
const negative: unknown = undefined;

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => isNull(positive)));
  },
  group: "isNull (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !isNull(negative)));
  },
  group: "isNull (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => isNull420(positive)));
  },
  group: "isNull (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !isNull420(negative)));
  },
  group: "isNull (negative)",
});
