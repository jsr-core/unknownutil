import { assert } from "@std/assert";
import { isBoolean as isBoolean420 } from "jsr:@core/unknownutil@4.2.0/is/boolean";
import { isBoolean } from "./boolean.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = true;
const negative: unknown = 0;

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => isBoolean(positive)));
  },
  group: "isBoolean (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !isBoolean(negative)));
  },
  group: "isBoolean (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => isBoolean420(positive)));
  },
  group: "isBoolean (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !isBoolean420(negative)));
  },
  group: "isBoolean (negative)",
});
