import { assert } from "@std/assert";
import { isUniformTupleOf as isUniformTupleOf420 } from "jsr:@core/unknownutil@4.2.0/is/uniform-tuple-of";
import { isUniformTupleOf } from "./uniform_tuple_of.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = [0, 0, 0];
const negative: unknown = [0, 0, 0, 0];

const predElse = (_x: unknown): _x is number[] => true;
const pred420 = isUniformTupleOf420(3, predElse);
const pred = isUniformTupleOf(3, predElse);

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive)));
  },
  group: "isUniformTupleOf (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative)));
  },
  group: "isUniformTupleOf (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive)));
  },
  group: "isUniformTupleOf (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative)));
  },
  group: "isUniformTupleOf (negative)",
});
