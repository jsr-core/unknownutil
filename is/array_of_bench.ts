import { assert } from "@std/assert";
import { isArrayOf as isArrayOf420 } from "jsr:@core/unknownutil@4.2.0/is/array-of";
import { isArrayOf } from "./array_of.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = [];
const positive10: unknown = Array.from({ length: 10 }).map(() => "");
const positive1000: unknown = Array.from({ length: 1000 }).map(() => "");
const negative: unknown = "";
const negative10: unknown = Array.from({ length: 10 }).map(() => 0);
const negative1000: unknown = Array.from({ length: 1000 }).map(() => 0);

const pred420 = isArrayOf420((x: unknown): x is string =>
  typeof x === "string"
);
const pred = isArrayOf((x: unknown): x is string => typeof x === "string");

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive)));
  },
  group: "isArrayOf (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive10)));
  },
  group: "isArrayOf (positive 10)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive1000)));
  },
  group: "isArrayOf (positive 1000)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative)));
  },
  group: "isArrayOf (negative)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative10)));
  },
  group: "isArrayOf (negative 10)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative1000)));
  },
  group: "isArrayOf (negative 1000)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive)));
  },
  group: "isArrayOf (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive10)));
  },
  group: "isArrayOf (positive 10)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive1000)));
  },
  group: "isArrayOf (positive 1000)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative)));
  },
  group: "isArrayOf (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative10)));
  },
  group: "isArrayOf (negative 10)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative1000)));
  },
  group: "isArrayOf (negative 1000)",
});
