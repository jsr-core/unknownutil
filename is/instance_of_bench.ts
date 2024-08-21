import { assert } from "@std/assert";
import { isInstanceOf as isInstanceOf420 } from "jsr:@core/unknownutil@4.2.0/is/instance-of";
import { isInstanceOf } from "./instance_of.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = Promise.resolve();
const negative: unknown = "";

const pred420 = isInstanceOf420(Promise);
const pred = isInstanceOf(Promise);

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => pred(positive)));
  },
  group: "isInstanceOf (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !pred(negative)));
  },
  group: "isInstanceOf (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => pred420(positive)));
  },
  group: "isInstanceOf (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !pred420(negative)));
  },
  group: "isInstanceOf (negative)",
});
