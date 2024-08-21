import { assert } from "@std/assert";
import { isObjectOf } from "./object_of.ts";
import { isPickOf as isPickOf420 } from "jsr:@core/unknownutil@4.2.0/is/pick-of";
import { isPickOf } from "./pick_of.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = { a: "" };
const positive10: unknown = Object.assign(
  { a: "" },
  Array.from({ length: 10 }),
);
const positive1000: unknown = Object.assign(
  { a: "" },
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
const pred420 = isPickOf420(predOrig, ["a"]);
const pred = isPickOf(predOrig, ["a"]);

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive)));
  },
  group: "isPickOf (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive10)));
  },
  group: "isPickOf (positive 10)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive1000)));
  },
  group: "isPickOf (positive 1000)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative)));
  },
  group: "isPickOf (negative)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative10)));
  },
  group: "isPickOf (negative 10)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative1000)));
  },
  group: "isPickOf (negative 1000)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive)));
  },
  group: "isPickOf (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive10)));
  },
  group: "isPickOf (positive 10)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive1000)));
  },
  group: "isPickOf (positive 1000)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative)));
  },
  group: "isPickOf (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative10)));
  },
  group: "isPickOf (negative 10)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative1000)));
  },
  group: "isPickOf (negative 1000)",
});
