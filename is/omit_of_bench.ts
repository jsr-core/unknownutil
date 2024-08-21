import { assert } from "@std/assert";
import { isObjectOf } from "./object_of.ts";
import { isOmitOf as isOmitOf420 } from "jsr:@core/unknownutil@4.2.0/is/omit-of";
import { isOmitOf } from "./omit_of.ts";

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
const pred420 = isOmitOf420(predOrig, ["b"]);
const pred = isOmitOf(predOrig, ["b"]);

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive)));
  },
  group: "isOmitOf (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive10)));
  },
  group: "isOmitOf (positive 10)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive1000)));
  },
  group: "isOmitOf (positive 1000)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative)));
  },
  group: "isOmitOf (negative)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative10)));
  },
  group: "isOmitOf (negative 10)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative1000)));
  },
  group: "isOmitOf (negative 1000)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive)));
  },
  group: "isOmitOf (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive10)));
  },
  group: "isOmitOf (positive 10)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive1000)));
  },
  group: "isOmitOf (positive 1000)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative)));
  },
  group: "isOmitOf (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative10)));
  },
  group: "isOmitOf (negative 10)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative1000)));
  },
  group: "isOmitOf (negative 1000)",
});
