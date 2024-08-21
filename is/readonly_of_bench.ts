import { assert } from "@std/assert";
import { isObjectOf } from "./object_of.ts";
import { isReadonlyOf as isReadonlyOf420 } from "jsr:@core/unknownutil@4.2.0/is/readonly-of";
import { isReadonlyOf } from "./readonly_of.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = { a: "", b: 0 };
const positive10: unknown = Object.assign(
  { a: "", b: 0 },
  Array.from({ length: 10 }),
);
const positive1000: unknown = Object.assign(
  { a: "", b: 0 },
  Array.from({ length: 1000 }),
);
const negative: unknown = {};
const negative10: unknown = Object.assign(
  {},
  Array.from({ length: 10 }),
);
const negative1000: unknown = Object.assign(
  {},
  Array.from({ length: 1000 }),
);

const predOrig = isObjectOf({
  a: (x: unknown): x is string => typeof x === "string",
  b: (x: unknown): x is number => typeof x === "number",
});
const pred420 = isReadonlyOf420(predOrig);
const pred = isReadonlyOf(predOrig);

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive)));
  },
  group: "isReadonlyOf (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive10)));
  },
  group: "isReadonlyOf (positive 10)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive1000)));
  },
  group: "isReadonlyOf (positive 1000)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative)));
  },
  group: "isReadonlyOf (negative)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative10)));
  },
  group: "isReadonlyOf (negative 10)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative1000)));
  },
  group: "isReadonlyOf (negative 1000)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive)));
  },
  group: "isReadonlyOf (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive10)));
  },
  group: "isReadonlyOf (positive 10)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive1000)));
  },
  group: "isReadonlyOf (positive 1000)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative)));
  },
  group: "isReadonlyOf (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative10)));
  },
  group: "isReadonlyOf (negative 10)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative1000)));
  },
  group: "isReadonlyOf (negative 1000)",
});
