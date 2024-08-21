import { assert } from "@std/assert";
import { isAny as isAny420 } from "jsr:@core/unknownutil@4.2.0/is/any";
import { isAny } from "./any.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = "";

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => isAny(positive)));
  },
  group: "isAny (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => isAny420(positive)));
  },
  group: "isAny (positive)",
});
