import { assert } from "@std/assert";
import { isMapOf as isMapOf420 } from "jsr:@core/unknownutil@4.2.0/is/map-of";
import { isMapOf } from "./map_of.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = new Map();
const positive10: unknown = new Map(
  Array.from({ length: 10 }).map((_, i) => [i.toString(), ""]),
);
const positive1000: unknown = new Map(
  Array.from({ length: 1000 }).map((_, i) => [i.toString(), ""]),
);
const negative: unknown = new Map([["", 0]]);
const negative10: unknown = new Map(
  Array.from({ length: 10 }).map((_, i) => [i.toString(), 0]),
);
const negative1000: unknown = new Map(
  Array.from({ length: 1000 }).map((_, i) => [i.toString(), 0]),
);

const pred1420 = isMapOf420((x: unknown): x is string => typeof x === "string");
const pred2420 = isMapOf420(
  (x: unknown): x is string => typeof x === "string",
  (x: unknown): x is string => typeof x === "string",
);
const pred1 = isMapOf((x: unknown): x is string => typeof x === "string");
const pred2 = isMapOf(
  (x: unknown): x is string => typeof x === "string",
  (x: unknown): x is string => typeof x === "string",
);

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred1(positive)));
  },
  group: "isMapOf<string, unknown> (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred1(positive10)));
  },
  group: "isMapOf<string, unknown> (positive 10)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred1(positive1000)));
  },
  group: "isMapOf<string, unknown> (positive 1000)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred1(negative)));
  },
  group: "isMapOf<string, unknown> (negative)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred1(negative10)));
  },
  group: "isMapOf<string, unknown> (negative 10)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred1(negative1000)));
  },
  group: "isMapOf<string, unknown> (negative 1000)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred2(positive)));
  },
  group: "isMapOf<string, string> (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred2(positive10)));
  },
  group: "isMapOf<string, string> (positive 10)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred2(positive1000)));
  },
  group: "isMapOf<string, string> (positive 1000)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred2(negative)));
  },
  group: "isMapOf<string, string> (negative)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred2(negative10)));
  },
  group: "isMapOf<string, string> (negative 10)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred2(negative1000)));
  },
  group: "isMapOf<string, string> (negative 1000)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred1420(positive)));
  },
  group: "isMapOf<string, unknown> (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred1420(positive10)));
  },
  group: "isMapOf<string, unknown> (positive 10)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred1420(positive1000)));
  },
  group: "isMapOf<string, unknown> (positive 1000)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred1420(negative)));
  },
  group: "isMapOf<string, unknown> (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred1420(negative10)));
  },
  group: "isMapOf<string, unknown> (negative 10)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred1420(negative1000)));
  },
  group: "isMapOf<string, unknown> (negative 1000)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred2420(positive)));
  },
  group: "isMapOf<string, string> (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred2420(positive10)));
  },
  group: "isMapOf<string, string> (positive 10)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred2420(positive1000)));
  },
  group: "isMapOf<string, string> (positive 1000)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred2420(negative)));
  },
  group: "isMapOf<string, string> (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred2420(negative10)));
  },
  group: "isMapOf<string, string> (negative 10)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred2420(negative1000)));
  },
  group: "isMapOf<string, string> (negative 1000)",
});