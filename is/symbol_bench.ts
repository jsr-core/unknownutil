import { assert } from "@std/assert";
import { isSymbol as isSymbol420 } from "jsr:@core/unknownutil@4.2.0/is/symbol";
import { isSymbol } from "./symbol.ts";

const repeats = Array.from({ length: 100 });
const positive: unknown = Symbol();
const negative: unknown = 0;

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => isSymbol(positive)));
  },
  group: "isSymbol (positive)",
});

Deno.bench({
  name: "current",
  fn() {
    assert(repeats.every(() => !isSymbol(negative)));
  },
  group: "isSymbol (negative)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => isSymbol420(positive)));
  },
  group: "isSymbol (positive)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    assert(repeats.every(() => !isSymbol420(negative)));
  },
  group: "isSymbol (negative)",
});
