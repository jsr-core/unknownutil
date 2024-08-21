import { assert } from "@std/assert";
import { isNullish as isNullish420 } from "jsr:@core/unknownutil@4.2.0/is/nullish";
import { isNullish } from "./nullish.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = null;
const negative: unknown = 0;

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => isNullish(positive)));
  },
  group: "isNullish (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !isNullish(negative)));
  },
  group: "isNullish (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => isNullish420(positive)));
  },
  group: "isNullish (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !isNullish420(negative)));
  },
  group: "isNullish (negative)",
});
