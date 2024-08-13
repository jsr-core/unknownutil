import { assertEquals } from "@std/assert";
import { assertType } from "@std/testing/types";
import { type Equal, testWithExamples } from "../_testutil.ts";
import { is } from "../is/mod.ts";
import type { AsOptional } from "../_annotation.ts";
import { asOptional, asUnoptional, hasOptional } from "./optional.ts";

Deno.test("asOptional<T>", async (t) => {
  await t.step("returns a property named predicate function", () => {
    const pred = asOptional(is.Number);
    assertEquals(typeof pred, "function");
    assertEquals(pred.name, "asOptional(isNumber)");
  });

  await t.step("returns a property named predicate function (nested)", () => {
    const pred = asOptional(asOptional(is.Number));
    assertEquals(typeof pred, "function");
    assertEquals(pred.name, "asOptional(isNumber)");
  });

  await t.step("returns a proper predicate function", async (t) => {
    const pred = asOptional(is.Number);
    await testWithExamples(t, pred, {
      validExamples: ["number", "undefined"],
    });
  });

  await t.step("with isObjectOf", async (t) => {
    const pred = is.ObjectOf({
      a: is.Number,
      b: asOptional(is.Number),
      c: asOptional(asOptional(is.Number)),
    });
    await t.step("predicated type is correct", () => {
      const v: unknown = undefined;
      if (pred(v)) {
        assertType<Equal<typeof v, { a: number; b?: number; c?: number }>>(
          true,
        );
      }
    });
  });

  await t.step("with isTupleOf", async (t) => {
    const pred = is.TupleOf([
      is.Number,
      asOptional(is.Number),
      asOptional(asOptional(is.Number)),
    ]);
    await t.step("predicated type is correct", () => {
      const v: unknown = undefined;
      if (pred(v)) {
        assertType<
          Equal<typeof v, [number, number | undefined, number | undefined]>
        >(
          true,
        );
      }
    });
  });

  await t.step("with isParametersOf", async (t) => {
    const pred = is.ParametersOf(
      [
        is.Number,
        asOptional(is.Number),
        asOptional(asOptional(is.Number)),
      ] as const,
    );
    await t.step("predicated type is correct", () => {
      const v: unknown = undefined;
      if (pred(v)) {
        assertType<
          Equal<typeof v, [number, number?, number?]>
        >(
          true,
        );
      }
    });
  });
});

Deno.test("asUnoptional<T>", async (t) => {
  await t.step("returns a property named predicate function", () => {
    const pred = asUnoptional(asOptional(is.Number));
    assertEquals(typeof pred, "function");
    assertEquals(pred.name, "isNumber");
  });

  await t.step("returns a property named predicate function (nested)", () => {
    const pred = asUnoptional(asUnoptional(asOptional(is.Number)));
    assertEquals(typeof pred, "function");
    assertEquals(pred.name, "isNumber");
  });

  await t.step("returns a proper predicate function", async (t) => {
    const pred = asUnoptional(asOptional(is.Number));
    await testWithExamples(t, pred, {
      validExamples: ["number"],
    });
  });

  await t.step("with isObjectOf", async (t) => {
    const pred = is.ObjectOf({
      a: is.Number,
      b: asUnoptional(asOptional(is.Number)),
      c: asUnoptional(asUnoptional(asOptional(is.Number))),
    });
    await t.step("predicated type is correct", () => {
      const v: unknown = undefined;
      if (pred(v)) {
        assertType<Equal<typeof v, { a: number; b: number; c: number }>>(
          true,
        );
      }
    });
  });

  await t.step("with isTupleOf", async (t) => {
    const pred = is.TupleOf([
      is.Number,
      asUnoptional(asOptional(is.Number)),
      asUnoptional(asUnoptional(asOptional(is.Number))),
    ]);
    await t.step("predicated type is correct", () => {
      const v: unknown = undefined;
      if (pred(v)) {
        assertType<
          Equal<typeof v, [number, number, number]>
        >(
          true,
        );
      }
    });
  });

  await t.step("with isParametersOf", async (t) => {
    const pred = is.ParametersOf(
      [
        is.Number,
        asUnoptional(asOptional(is.Number)),
        asUnoptional(asUnoptional(asOptional(is.Number))),
      ] as const,
    );
    await t.step("predicated type is correct", () => {
      const v: unknown = undefined;
      if (pred(v)) {
        assertType<
          Equal<typeof v, [number, number, number]>
        >(
          true,
        );
      }
    });
  });
});

Deno.test("hasOptional<P>", async (t) => {
  await t.step("returns true on AsOptional<T> predicate", () => {
    const pred = asOptional(is.Number);
    assertEquals(hasOptional(pred), true);
  });

  await t.step("returns true on non AsOptional<T> predicate", () => {
    const pred = is.Number;
    assertEquals(hasOptional(pred), false);
  });

  await t.step("predicated type is correct", () => {
    const pred = asOptional(is.Number);
    type P = typeof pred;
    if (hasOptional(pred)) {
      assertType<Equal<typeof pred, P & AsOptional<number>>>(true);
    }
  });
});
