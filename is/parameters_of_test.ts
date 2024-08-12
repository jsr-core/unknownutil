import { assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { assertType } from "@std/testing/types";
import type { Equal } from "../_testutil.ts";
import { as } from "../as/mod.ts";
import { is } from "./mod.ts";
import { isParametersOf } from "./parameters_of.ts";

Deno.test("isParametersOf<T>", async (t) => {
  await t.step("returns properly named predicate function", async (t) => {
    assertEquals(typeof isParametersOf([]), "function");
    await assertSnapshot(
      t,
      isParametersOf([is.Number, is.String, as.Optional(is.Boolean)]).name,
    );
    await assertSnapshot(
      t,
      isParametersOf([(_x): _x is string => false]).name,
    );
    await assertSnapshot(
      t,
      isParametersOf([]).name,
    );
    await assertSnapshot(
      t,
      isParametersOf([
        isParametersOf([
          isParametersOf([is.Number, is.String, as.Optional(is.Boolean)]),
        ]),
      ]).name,
    );
  });

  await t.step("returns true on T tuple", () => {
    const predTup = [is.Number, is.String, as.Optional(is.Boolean)] as const;
    assertEquals(isParametersOf(predTup)([0, "a", true]), true);
    assertEquals(isParametersOf(predTup)([0, "a"]), true);
    assertEquals(isParametersOf(predTup)([0, "a", undefined]), true);
  });

  await t.step("returns false on non T tuple", () => {
    const predTup = [is.Number, is.String, as.Optional(is.Boolean)] as const;
    assertEquals(isParametersOf(predTup)([0, 1, 2]), false);
    assertEquals(isParametersOf(predTup)([0]), false);
    assertEquals(isParametersOf(predTup)([0, "a", true, 0]), false);
  });

  await t.step("predicated type is correct", () => {
    const predTup = [
      as.Optional(is.Number),
      is.String,
      as.Optional(is.String),
      as.Optional(is.Boolean),
    ] as const;
    const a: unknown = [0, "a"];
    if (isParametersOf(predTup)(a)) {
      assertType<
        Equal<typeof a, [number | undefined, string, string?, boolean?]>
      >(true);
    }
  });
});

Deno.test("isParametersOf<T, R>", async (t) => {
  await t.step("returns properly named predicate function", async (t) => {
    assertEquals(typeof isParametersOf([], is.Array), "function");
    await assertSnapshot(
      t,
      isParametersOf([is.Number, is.String, as.Optional(is.Boolean)], is.Array)
        .name,
    );
    await assertSnapshot(
      t,
      isParametersOf([(_x): _x is string => false], is.ArrayOf(is.String))
        .name,
    );
    await assertSnapshot(
      t,
      isParametersOf([], is.ArrayOf(is.String)).name,
    );
    await assertSnapshot(
      t,
      isParametersOf([
        isParametersOf(
          [isParametersOf(
            [is.Number, is.String, as.Optional(is.Boolean)],
            is.Array,
          )],
          is.Array,
        ),
      ]).name,
    );
  });

  await t.step("returns true on T tuple", () => {
    const predTup = [is.Number, is.String, as.Optional(is.Boolean)] as const;
    const predRest = is.ArrayOf(is.Number);
    assertEquals(
      isParametersOf(predTup, predRest)([0, "a", true, 0, 1, 2]),
      true,
    );
    assertEquals(
      isParametersOf(predTup, predRest)([0, "a", undefined, 0, 1, 2]),
      true,
    );
    assertEquals(isParametersOf(predTup, predRest)([0, "a"]), true);
  });

  await t.step("returns false on non T tuple", () => {
    const predTup = [is.Number, is.String, as.Optional(is.Boolean)] as const;
    const predRest = is.ArrayOf(is.String);
    assertEquals(isParametersOf(predTup, predRest)("a"), false, "Not an array");
    assertEquals(
      isParametersOf(predTup, predRest)([0]),
      false,
      "Less than `predTup.length` - optional-count",
    );
    assertEquals(
      isParametersOf(predTup, predRest)([0, 1, 2]),
      false,
      "Not match `predTup` and no rest elements",
    );
    assertEquals(
      isParametersOf(predTup, predRest)([0, 1, 2, 0, 1, 2]),
      false,
      "Not match `predTup` and `predRest`",
    );
    assertEquals(
      isParametersOf(predTup, predRest)([0, "a", true, 0, 1, 2]),
      false,
      "Match `predTup` but not match `predRest`",
    );
    assertEquals(
      isParametersOf(predTup, predRest)([0, "a", undefined, 0, 1, 2]),
      false,
      "Match `predTup` but not match `predRest`",
    );
    assertEquals(
      isParametersOf(predTup, predRest)([0, "a", "b", "a", "b", "c"]),
      false,
      "Match `predRest` but not match `predTup`",
    );
    assertEquals(
      isParametersOf(predTup, predRest)([0, "a", "a", "b", "c"]),
      false,
      "Match `predRest` but no optional parameters",
    );
  });

  await t.step("predicated type is correct", () => {
    const predTup = [
      as.Optional(is.Number),
      is.String,
      as.Optional(is.String),
      as.Optional(is.Boolean),
    ] as const;
    const predRest = is.ArrayOf(is.Number);
    const a: unknown = [0, "a"];
    if (isParametersOf(predTup, predRest)(a)) {
      assertType<
        Equal<
          typeof a,
          [number | undefined, string, string?, boolean?, ...number[]]
        >
      >(
        true,
      );
    }
  });
});
