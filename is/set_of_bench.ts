import { assert } from "@std/assert";
import { isSetOf as isSetOf420 } from "jsr:@core/unknownutil@4.2.0/is/set-of";
import { isSetOf } from "./set_of.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = new Set();
const positive10: unknown = new Set(
  Array.from({ length: 10 }).map((_, i) => i.toString()),
);
const positive1000: unknown = new Set(
  Array.from({ length: 1000 }).map((_, i) => i.toString()),
);
const negative: unknown = { "": 0 };
const negative10: unknown = new Set(
  Array.from({ length: 10 }).map((_, i) => i),
);
const negative1000: unknown = new Set(
  Array.from({ length: 1000 }).map((_, i) => i),
);

const pred420 = isSetOf420((x: unknown): x is string => typeof x === "string");
const pred = isSetOf((x: unknown): x is string => typeof x === "string");

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive)));
  },
  group: "isSetOf (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive10)));
  },
  group: "isSetOf (positive 10)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive1000)));
  },
  group: "isSetOf (positive 1000)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative)));
  },
  group: "isSetOf (negative)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative10)));
  },
  group: "isSetOf (negative 10)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative1000)));
  },
  group: "isSetOf (negative 1000)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive)));
  },
  group: "isSetOf (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive10)));
  },
  group: "isSetOf (positive 10)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive1000)));
  },
  group: "isSetOf (positive 1000)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative)));
  },
  group: "isSetOf (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative10)));
  },
  group: "isSetOf (negative 10)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative1000)));
  },
  group: "isSetOf (negative 1000)",
});
