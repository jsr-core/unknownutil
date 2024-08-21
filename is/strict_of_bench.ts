import { assert } from "@std/assert";
import { isObjectOf } from "./object_of.ts";
import { isStrictOf as isStrictOf420 } from "jsr:@core/unknownutil@4.2.0/is/strict-of";
import { isStrictOf } from "./strict_of.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = { a: "", b: 0 };
const negative: unknown = { a: "", b: 0, c: true };

const predOrig = isObjectOf({
  a: (x: unknown): x is string => typeof x === "string",
  b: (x: unknown): x is number => typeof x === "number",
});
const pred420 = isStrictOf420(predOrig);
const pred = isStrictOf(predOrig);

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive)));
  },
  group: "isStrictOf (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative)));
  },
  group: "isStrictOf (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive)));
  },
  group: "isStrictOf (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative)));
  },
  group: "isStrictOf (negative)",
});
