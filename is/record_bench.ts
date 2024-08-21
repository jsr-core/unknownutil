import { assert } from "@std/assert";
import { isRecord as isRecord420 } from "jsr:@core/unknownutil@4.2.0/is/record";
import { isRecord } from "./record.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = {};
const negative: unknown = 0;

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => isRecord(positive)));
  },
  group: "isRecord (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !isRecord(negative)));
  },
  group: "isRecord (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => isRecord420(positive)));
  },
  group: "isRecord (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !isRecord420(negative)));
  },
  group: "isRecord (negative)",
});
