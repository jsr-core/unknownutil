import { assert } from "@std/assert";
import { isObjectOf } from "./object_of.ts";
import { isUnionOf as isUnionOf420 } from "jsr:@core/unknownutil@4.2.0/is/union-of";
import { isUnionOf } from "./union_of.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = { a: "", b: 0, c: true };
const positive10: unknown = Object.assign(
  { a: "", b: 0, c: true },
  Array.from({ length: 10 }),
);
const positive1000: unknown = Object.assign(
  { a: "", b: 0, c: true },
  Array.from({ length: 1000 }),
);
const negative: unknown = {};
const negative10: unknown = Object.assign({}, Array.from({ length: 10 }));
const negative1000: unknown = Object.assign({}, Array.from({ length: 1000 }));

const preds = [
  isObjectOf({
    a: (x: unknown): x is string => typeof x === "string",
  }),
  isObjectOf({
    b: (x: unknown): x is number => typeof x === "number",
  }),
  isObjectOf({
    c: (x: unknown): x is boolean => typeof x === "boolean",
  }),
] as const;
const pred420 = isUnionOf420(preds);
const pred = isUnionOf(preds);

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive)));
  },
  group: "isUnionOf (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive10)));
  },
  group: "isUnionOf (positive 10)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive1000)));
  },
  group: "isUnionOf (positive 1000)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative)));
  },
  group: "isUnionOf (negative)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative10)));
  },
  group: "isUnionOf (negative 10)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative1000)));
  },
  group: "isUnionOf (negative 1000)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive)));
  },
  group: "isUnionOf (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive10)));
  },
  group: "isUnionOf (positive 10)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive1000)));
  },
  group: "isUnionOf (positive 1000)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative)));
  },
  group: "isUnionOf (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative10)));
  },
  group: "isUnionOf (negative 10)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative1000)));
  },
  group: "isUnionOf (negative 1000)",
});
