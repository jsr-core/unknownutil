import { assert } from "@std/assert";
import { isLiteralOf as isLiteralOf420 } from "jsr:@core/unknownutil@4.2.0/is/literal-of";
import { isLiteralOf } from "./literal_of.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = "hello";
const negative: unknown = "world";

const pred420 = isLiteralOf420("hello");
const pred = isLiteralOf("hello");

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive)));
  },
  group: "isLiteralOf (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative)));
  },
  group: "isLiteralOf (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive)));
  },
  group: "isLiteralOf (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative)));
  },
  group: "isLiteralOf (negative)",
});
