import { assert } from "@std/assert";
import { isRecordObject as isRecordObject420 } from "jsr:@core/unknownutil@4.2.0/is/record-object";
import { isRecordObject } from "./record_object.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = {};
const negative: unknown = new Map();

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => isRecordObject(positive)));
  },
  group: "isRecordObject (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !isRecordObject(negative)));
  },
  group: "isRecordObject (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => isRecordObject420(positive)));
  },
  group: "isRecordObject (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !isRecordObject420(negative)));
  },
  group: "isRecordObject (negative)",
});
