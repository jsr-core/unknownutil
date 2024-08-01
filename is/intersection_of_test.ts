import { assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { assertType } from "@std/testing/types";
import { type Equal, testWithExamples } from "../_testutil.ts";
import { is } from "./mod.ts";
import { isIntersectionOf } from "./intersection_of.ts";

Deno.test("isIntersectionOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(
      t,
      isIntersectionOf([
        is.ObjectOf({ a: is.Number }),
        is.ObjectOf({ b: is.String }),
      ]).name,
      "Should return `isObjectOf`, if all predicates that",
    );
    await assertSnapshot(
      t,
      isIntersectionOf([
        is.String,
      ]).name,
      "Should return as is, if there is only one predicate",
    );
    await assertSnapshot(
      t,
      isIntersectionOf([
        is.Function,
        is.ObjectOf({ b: is.String }),
      ]).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const objPreds = [
      is.ObjectOf({ a: is.Number }),
      is.ObjectOf({ b: is.String }),
    ] as const;
    const funcPreds = [
      is.Function,
      is.ObjectOf({ b: is.String }),
    ] as const;
    const a: unknown = { a: 0, b: "a" };
    if (isIntersectionOf(objPreds)(a)) {
      assertType<Equal<typeof a, { a: number } & { b: string }>>(true);
    }
    if (isIntersectionOf([is.String])(a)) {
      assertType<Equal<typeof a, string>>(true);
    }
    if (isIntersectionOf(funcPreds)(a)) {
      assertType<
        Equal<
          typeof a,
          & ((...args: unknown[]) => unknown)
          & { b: string }
        >
      >(true);
    }
  });
  await t.step("returns true on all of T", () => {
    const objPreds = [
      is.ObjectOf({ a: is.Number }),
      is.ObjectOf({ b: is.String }),
    ] as const;
    const funcPreds = [
      is.Function,
      is.ObjectOf({ b: is.String }),
    ] as const;
    const f = Object.assign(() => void 0, { b: "a" });
    assertEquals(isIntersectionOf(objPreds)({ a: 0, b: "a" }), true);
    assertEquals(isIntersectionOf([is.String])("a"), true);
    assertEquals(isIntersectionOf(funcPreds)(f), true);
  });
  await t.step("returns false on non of T", async (t) => {
    const preds = [
      is.ObjectOf({ a: is.Number }),
      is.ObjectOf({ b: is.String }),
    ] as const;
    assertEquals(
      isIntersectionOf(preds)({ a: 0, b: 0 }),
      false,
      "Some properties has wrong type",
    );
    assertEquals(
      isIntersectionOf(preds)({ a: 0 }),
      false,
      "Some properties does not exists",
    );
    await testWithExamples(t, isIntersectionOf(preds), {
      excludeExamples: ["record"],
    });
  });
  await t.step("returns false on non of T with any predicates", async (t) => {
    const preds = [
      is.Function,
      is.ObjectOf({ b: is.String }),
    ] as const;
    assertEquals(
      isIntersectionOf(preds)({ b: "a" }),
      false,
      "Not a function object",
    );
    assertEquals(
      isIntersectionOf(preds)(() => void 0),
      false,
      "Some properties does not exists in Function object",
    );
    await testWithExamples(t, isIntersectionOf(preds), {
      excludeExamples: ["record"],
    });
  });
  await t.step("asdf", async (t) => {
    const preds = [
      is.ObjectOf({ a: is.String }),
      is.ObjectOf({ b: is.String }),
    ] as const;
    assertEquals(
      is.PickOf(isIntersectionOf(preds), ["a"])({ a: "a" }),
      true,
      "All properties has correct type",
    );
    assertEquals(
      isIntersectionOf(preds)({ b: "a" }),
      false,
      "Not a function object",
    );
    assertEquals(
      isIntersectionOf(preds)(() => void 0),
      false,
      "Some properties does not exists in Function object",
    );
    await testWithExamples(t, isIntersectionOf(preds), {
      excludeExamples: ["record"],
    });
  });
});
