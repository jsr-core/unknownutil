import { assert } from "@std/assert";
import { isLiteralOneOf as isLiteralOneOf420 } from "jsr:@core/unknownutil@4.2.0/is/literal-one-of";
import { isLiteralOneOf } from "./literal_one_of.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = "hello";
const negative: unknown = "goodbye";

const pred420 = isLiteralOneOf420(["hello", "world"] as const);
const pred = isLiteralOneOf(["hello", "world"] as const);

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive)));
  },
  group: "isLiteralOneOf (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative)));
  },
  group: "isLiteralOneOf (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive)));
  },
  group: "isLiteralOneOf (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative)));
  },
  group: "isLiteralOneOf (negative)",
});
