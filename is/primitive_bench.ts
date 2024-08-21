import { assert } from "@std/assert";
import { isPrimitive as isPrimitive420 } from "jsr:@core/unknownutil@4.2.0/is/primitive";
import { isPrimitive } from "./primitive.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = 0;
const negative: unknown = {};

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => isPrimitive(positive)));
  },
  group: "isPrimitive (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !isPrimitive(negative)));
  },
  group: "isPrimitive (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => isPrimitive420(positive)));
  },
  group: "isPrimitive (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !isPrimitive420(negative)));
  },
  group: "isPrimitive (negative)",
});
