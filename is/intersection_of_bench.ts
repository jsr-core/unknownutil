import { assert } from "@std/assert";
import { isObjectOf } from "./object_of.ts";
import { isIntersectionOf as isIntersectionOf420 } from "jsr:@core/unknownutil@4.2.0/is/intersection-of";
import { isIntersectionOf } from "./intersection_of.ts";

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
  // deno-lint-ignore ban-types
  (x: unknown): x is {} => typeof x === "object",
] as const;
const pred420 = isIntersectionOf420(preds);
const pred = isIntersectionOf(preds);

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive)));
  },
  group: "isIntersectionOf (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive10)));
  },
  group: "isIntersectionOf (positive 10)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive1000)));
  },
  group: "isIntersectionOf (positive 1000)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative)));
  },
  group: "isIntersectionOf (negative)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative10)));
  },
  group: "isIntersectionOf (negative 10)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative1000)));
  },
  group: "isIntersectionOf (negative 1000)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive)));
  },
  group: "isIntersectionOf (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive10)));
  },
  group: "isIntersectionOf (positive 10)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive1000)));
  },
  group: "isIntersectionOf (positive 1000)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative)));
  },
  group: "isIntersectionOf (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative10)));
  },
  group: "isIntersectionOf (negative 10)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative1000)));
  },
  group: "isIntersectionOf (negative 1000)",
});
