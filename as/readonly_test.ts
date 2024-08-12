import { assertEquals } from "@std/assert";
import { assertType } from "@std/testing/types";
import { type Equal, testWithExamples } from "../_testutil.ts";
import { is } from "../is/mod.ts";
import type { AsReadonly } from "../_annotation.ts";
import { asReadonly, asUnreadonly, hasReadonly } from "./readonly.ts";

Deno.test("asReadonly<T>", async (t) => {
  await t.step("returns a property named predicate function", () => {
    const pred = asReadonly(is.Number);
    assertEquals(typeof pred, "function");
    assertEquals(pred.name, "asReadonly(isNumber)");
  });

  await t.step("returns a property named predicate function (nested)", () => {
    const pred = asReadonly(asReadonly(is.Number));
    assertEquals(typeof pred, "function");
    assertEquals(pred.name, "asReadonly(isNumber)");
  });

  await t.step("returns a proper predicate function", async (t) => {
    const pred = asReadonly(is.Number);
    await testWithExamples(t, pred, {
      validExamples: ["number"],
    });
  });

  await t.step("with isObjectOf", async (t) => {
    const pred = is.ObjectOf({
      a: is.Number,
      b: asReadonly(is.Number),
      c: asReadonly(asReadonly(is.Number)),
    });
    await t.step("predicated type is correct", () => {
      const v: unknown = undefined;
      if (pred(v)) {
        assertType<
          Equal<typeof v, { a: number; readonly b: number; readonly c: number }>
        >(
          true,
        );
      }
    });
  });

  await t.step("with isTupleOf", async (t) => {
    const pred = is.TupleOf([
      is.Number,
      asReadonly(is.Number),
      asReadonly(asReadonly(is.Number)),
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
        asReadonly(is.Number),
        asReadonly(asReadonly(is.Number)),
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

Deno.test("asUnreadonly<T>", async (t) => {
  await t.step("returns a property named predicate function", () => {
    const pred = asUnreadonly(asReadonly(is.Number));
    assertEquals(typeof pred, "function");
    assertEquals(pred.name, "isNumber");
  });

  await t.step("returns a property named predicate function (nested)", () => {
    const pred = asUnreadonly(asUnreadonly(asReadonly(is.Number)));
    assertEquals(typeof pred, "function");
    assertEquals(pred.name, "isNumber");
  });

  await t.step("returns a proper predicate function", async (t) => {
    const pred = asUnreadonly(asReadonly(is.Number));
    await testWithExamples(t, pred, {
      validExamples: ["number"],
    });
  });

  await t.step("with isObjectOf", async (t) => {
    const pred = is.ObjectOf({
      a: is.Number,
      b: asUnreadonly(asReadonly(is.Number)),
      c: asUnreadonly(asUnreadonly(asReadonly(is.Number))),
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
      asUnreadonly(asReadonly(is.Number)),
      asUnreadonly(asUnreadonly(asReadonly(is.Number))),
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
        asUnreadonly(asReadonly(is.Number)),
        asUnreadonly(asUnreadonly(asReadonly(is.Number))),
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

Deno.test("hasReadonly<P>", async (t) => {
  await t.step("returns true on AsReadonly<T> predicate", () => {
    const pred = asReadonly(is.Number);
    assertEquals(hasReadonly(pred), true);
  });

  await t.step("returns true on non AsReadonly<T> predicate", () => {
    const pred = is.Number;
    assertEquals(hasReadonly(pred), false);
  });

  await t.step("predicated type is correct", () => {
    const pred = asReadonly(is.Number);
    type P = typeof pred;
    if (hasReadonly(pred)) {
      assertType<Equal<typeof pred, P & AsReadonly>>(true);
    }
  });
});
