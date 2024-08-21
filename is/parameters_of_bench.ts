import { assert } from "@std/assert";
import { isParametersOf as isParametersOf420 } from "jsr:@core/unknownutil@4.2.0/is/parameters-of";
import { isParametersOf } from "./parameters_of.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = ["", 0];
const positive10: unknown = ["", 0, ...Array.from({ length: 10 })];
const positive1000: unknown = ["", 0, ...Array.from({ length: 1000 })];
const negative: unknown = [];
const negative10: unknown = Array.from({ length: 10 });
const negative1000: unknown = Array.from({ length: 1000 });

const predTup = [
  (x: unknown): x is string => typeof x === "string",
  (x: unknown): x is number => typeof x === "number",
] as const;
const predElse = (_x: unknown): _x is number[] => true;
const pred420 = isParametersOf420(predTup, predElse);
const pred = isParametersOf(predTup, predElse);

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive)));
  },
  group: "isParametersOf (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive10)));
  },
  group: "isParametersOf (positive 10)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive1000)));
  },
  group: "isParametersOf (positive 1000)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative)));
  },
  group: "isParametersOf (negative)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative10)));
  },
  group: "isParametersOf (negative 10)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative1000)));
  },
  group: "isParametersOf (negative 1000)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive)));
  },
  group: "isParametersOf (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive10)));
  },
  group: "isParametersOf (positive 10)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive1000)));
  },
  group: "isParametersOf (positive 1000)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative)));
  },
  group: "isParametersOf (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative10)));
  },
  group: "isParametersOf (negative 10)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative1000)));
  },
  group: "isParametersOf (negative 1000)",
});
