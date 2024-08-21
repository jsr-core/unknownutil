import { assert } from "@std/assert";
import { isString as isString420 } from "jsr:@core/unknownutil@4.2.0/is/string";
import { isString } from "./string.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = "";
const negative: unknown = 0;

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => isString(positive)));
  },
  group: "isString (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !isString(negative)));
  },
  group: "isString (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => isString420(positive)));
  },
  group: "isString (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !isString420(negative)));
  },
  group: "isString (negative)",
});
