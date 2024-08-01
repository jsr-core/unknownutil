import { assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { assertType } from "@std/testing/types";
import { type Equal, testWithExamples } from "../_testutil.ts";
import { is } from "./mod.ts";
import { isTupleOf } from "./tuple_of.ts";

Deno.test("isTupleOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(
      t,
      isTupleOf([is.Number, is.String, is.Boolean]).name,
    );
    await assertSnapshot(
      t,
      isTupleOf([(_x): _x is string => false]).name,
    );
    // Nested
    await assertSnapshot(
      t,
      isTupleOf([isTupleOf([isTupleOf([is.Number, is.String, is.Boolean])])])
        .name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const predTup = [is.Number, is.String, is.Boolean] as const;
    const a: unknown = [0, "a", true];
    if (isTupleOf(predTup)(a)) {
      assertType<Equal<typeof a, [number, string, boolean]>>(true);
    }
  });
  await t.step("returns true on T tuple", () => {
    const predTup = [is.Number, is.String, is.Boolean] as const;
    assertEquals(isTupleOf(predTup)([0, "a", true]), true);
  });
  await t.step("returns false on non T tuple", () => {
    const predTup = [is.Number, is.String, is.Boolean] as const;
    assertEquals(isTupleOf(predTup)([0, 1, 2]), false);
    assertEquals(isTupleOf(predTup)([0, "a"]), false);
    assertEquals(isTupleOf(predTup)([0, "a", true, 0]), false);
  });
  await testWithExamples(t, isTupleOf([(_: unknown): _ is unknown => true]), {
    excludeExamples: ["array"],
  });
});

Deno.test("isTupleOf<T, E>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(
      t,
      isTupleOf([is.Number, is.String, is.Boolean], is.Array).name,
    );
    await assertSnapshot(
      t,
      isTupleOf([(_x): _x is string => false], is.ArrayOf(is.String))
        .name,
    );
    // Nested
    await assertSnapshot(
      t,
      isTupleOf([
        isTupleOf(
          [isTupleOf([is.Number, is.String, is.Boolean], is.Array)],
          is.Array,
        ),
      ]).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const predTup = [is.Number, is.String, is.Boolean] as const;
    const predElse = is.ArrayOf(is.Number);
    const a: unknown = [0, "a", true, 0, 1, 2];
    if (isTupleOf(predTup, predElse)(a)) {
      assertType<Equal<typeof a, [number, string, boolean, ...number[]]>>(
        true,
      );
    }
  });
  await t.step("returns true on T tuple", () => {
    const predTup = [is.Number, is.String, is.Boolean] as const;
    const predElse = is.ArrayOf(is.Number);
    assertEquals(isTupleOf(predTup, predElse)([0, "a", true, 0, 1, 2]), true);
  });
  await t.step("returns false on non T tuple", () => {
    const predTup = [is.Number, is.String, is.Boolean] as const;
    const predElse = is.ArrayOf(is.String);
    assertEquals(isTupleOf(predTup, predElse)([0, 1, 2, 0, 1, 2]), false);
    assertEquals(isTupleOf(predTup, predElse)([0, "a", 0, 1, 2]), false);
    assertEquals(
      isTupleOf(predTup, predElse)([0, "a", true, 0, 0, 1, 2]),
      false,
    );
    assertEquals(isTupleOf(predTup, predElse)([0, "a", true, 0, 1, 2]), false);
  });
  const predElse = is.Array;
  await testWithExamples(
    t,
    isTupleOf([(_: unknown): _ is unknown => true], predElse),
    {
      excludeExamples: ["array"],
    },
  );
});
