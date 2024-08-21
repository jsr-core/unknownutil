import { assert } from "@std/assert";
import { isRecordOf as isRecordOf420 } from "jsr:@core/unknownutil@4.2.0/is/record-of";
import { isRecordOf } from "./record_of.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = {};
const positive10: unknown = Object.fromEntries(
  Array.from({ length: 10 }).map((_, i) => [i.toString(), ""]),
);
const positive1000: unknown = Object.fromEntries(
  Array.from({ length: 1000 }).map((_, i) => [i.toString(), ""]),
);
const negative: unknown = { "": 0 };
const negative10: unknown = Object.fromEntries(
  Array.from({ length: 10 }).map((_, i) => [i.toString(), 0]),
);
const negative1000: unknown = Object.fromEntries(
  Array.from({ length: 1000 }).map((_, i) => [i.toString(), 0]),
);

const pred1420 = isRecordOf420((x: unknown): x is string =>
  typeof x === "string"
);
const pred2420 = isRecordOf420(
  (x: unknown): x is string => typeof x === "string",
  (x: unknown): x is string => typeof x === "string",
);
const pred1 = isRecordOf((x: unknown): x is string => typeof x === "string");
const pred2 = isRecordOf(
  (x: unknown): x is string => typeof x === "string",
  (x: unknown): x is string => typeof x === "string",
);

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred1(positive)));
  },
  group: "isRecordOf<string, unknown> (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred1(positive10)));
  },
  group: "isRecordOf<string, unknown> (positive 10)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred1(positive1000)));
  },
  group: "isRecordOf<string, unknown> (positive 1000)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred1(negative)));
  },
  group: "isRecordOf<string, unknown> (negative)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred1(negative10)));
  },
  group: "isRecordOf<string, unknown> (negative 10)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred1(negative1000)));
  },
  group: "isRecordOf<string, unknown> (negative 1000)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred2(positive)));
  },
  group: "isRecordOf<string, string> (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred2(positive10)));
  },
  group: "isRecordOf<string, string> (positive 10)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred2(positive1000)));
  },
  group: "isRecordOf<string, string> (positive 1000)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred2(negative)));
  },
  group: "isRecordOf<string, string> (negative)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred2(negative10)));
  },
  group: "isRecordOf<string, string> (negative 10)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred2(negative1000)));
  },
  group: "isRecordOf<string, string> (negative 1000)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred1420(positive)));
  },
  group: "isRecordOf<string, unknown> (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred1420(positive10)));
  },
  group: "isRecordOf<string, unknown> (positive 10)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred1420(positive1000)));
  },
  group: "isRecordOf<string, unknown> (positive 1000)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred1420(negative)));
  },
  group: "isRecordOf<string, unknown> (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred1420(negative10)));
  },
  group: "isRecordOf<string, unknown> (negative 10)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred1420(negative1000)));
  },
  group: "isRecordOf<string, unknown> (negative 1000)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred2420(positive)));
  },
  group: "isRecordOf<string, string> (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred2420(positive10)));
  },
  group: "isRecordOf<string, string> (positive 10)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred2420(positive1000)));
  },
  group: "isRecordOf<string, string> (positive 1000)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred2420(negative)));
  },
  group: "isRecordOf<string, string> (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred2420(negative10)));
  },
  group: "isRecordOf<string, string> (negative 10)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred2420(negative1000)));
  },
  group: "isRecordOf<string, string> (negative 1000)",
});
