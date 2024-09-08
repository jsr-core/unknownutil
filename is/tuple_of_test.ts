import { assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { assertType, type IsExact } from "@std/testing/types";
import { is } from "./mod.ts";
import { isTupleOf } from "./tuple_of.ts";

Deno.test("isTupleOf<T>", async (t) => {
  await t.step("returns properly named predicate function", async (t) => {
    await assertSnapshot(
      t,
      isTupleOf([is.Number, is.String, is.Boolean]).name,
    );
    await assertSnapshot(
      t,
      isTupleOf([(_x): _x is string => false]).name,
    );
    await assertSnapshot(
      t,
      isTupleOf([
        isTupleOf([
          isTupleOf([is.Number, is.String, is.Boolean]),
        ]),
      ]).name,
    );
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

  await t.step("predicated type is correct", () => {
    const predTup = [is.Number, is.String, is.Boolean] as const;
    const a: unknown = [0, "a", true];
    if (isTupleOf(predTup)(a)) {
      assertType<IsExact<typeof a, [number, string, boolean]>>(true);
    }
  });
});

Deno.test("isTupleOf<T, R>", async (t) => {
  await t.step("returns properly named predicate function", async (t) => {
    await assertSnapshot(
      t,
      isTupleOf([is.Number, is.String, is.Boolean], is.Array).name,
    );
    await assertSnapshot(
      t,
      isTupleOf(
        [(_x): _x is string => false],
        is.ArrayOf(is.String),
      ).name,
    );
    await assertSnapshot(
      t,
      isTupleOf([
        isTupleOf(
          [
            isTupleOf(
              [is.Number, is.String, is.Boolean],
              is.ArrayOf(is.String),
            ),
          ],
          is.Array,
        ),
      ]).name,
    );
  });

  await t.step("returns true on T tuple", () => {
    const predTup = [is.Number, is.String, is.Boolean] as const;
    const predRest = is.ArrayOf(is.Number);
    assertEquals(isTupleOf(predTup, predRest)([0, "a", true]), true);
    assertEquals(isTupleOf(predTup, predRest)([0, "a", true, 0, 1, 2]), true);
  });

  await t.step("returns false on non T tuple", () => {
    const predTup = [is.Number, is.String, is.Boolean] as const;
    const predRest = is.ArrayOf(is.String);
    assertEquals(isTupleOf(predTup, predRest)("a"), false, "Not an array");
    assertEquals(
      isTupleOf(predTup, predRest)([0, "a"]),
      false,
      "Less than `predTup.length`",
    );
    assertEquals(
      isTupleOf(predTup, predRest)([0, 1, 2]),
      false,
      "Not match `predTup` and no rest elements",
    );
    assertEquals(
      isTupleOf(predTup, predRest)([0, 1, 2, 0, 1, 2]),
      false,
      "Not match `predTup` and `predRest`",
    );
    assertEquals(
      isTupleOf(predTup, predRest)([0, "a", true, 0, 1, 2]),
      false,
      "Match `predTup` but not match `predRest`",
    );
    assertEquals(
      isTupleOf(predTup, predRest)([0, "a", "b", "a", "b", "c"]),
      false,
      "Match `predRest` but not match `predTup`",
    );
  });

  await t.step("predicated type is correct", () => {
    const predTup = [is.Number, is.String, is.Boolean] as const;
    const predRest = is.ArrayOf(is.Number);
    const a: unknown = [0, "a", true, 0, 1, 2];
    if (isTupleOf(predTup, predRest)(a)) {
      assertType<IsExact<typeof a, [number, string, boolean, ...number[]]>>(
        true,
      );
    }
  });
});

Deno.test("isTupleOf<R, T>", async (t) => {
  await t.step("returns properly named predicate function", async (t) => {
    await assertSnapshot(
      t,
      isTupleOf(is.Array, [is.Number, is.String, is.Boolean]).name,
    );
    await assertSnapshot(
      t,
      isTupleOf(
        is.ArrayOf(is.String),
        [(_x): _x is string => false],
      ).name,
    );
    await assertSnapshot(
      t,
      isTupleOf([
        isTupleOf(
          is.Array,
          [
            isTupleOf(
              is.ArrayOf(is.String),
              [is.Number, is.String, is.Boolean],
            ),
          ],
        ),
      ]).name,
    );
  });

  await t.step("returns true on T tuple", () => {
    const predRest = is.ArrayOf(is.Number);
    const predTup = [is.Number, is.String, is.Boolean] as const;
    assertEquals(isTupleOf(predRest, predTup)([0, "a", true]), true);
    assertEquals(isTupleOf(predRest, predTup)([0, 1, 2, 0, "a", true]), true);
  });

  await t.step("returns false on non T tuple", () => {
    const predRest = is.ArrayOf(is.String);
    const predTup = [is.Number, is.String, is.Boolean] as const;
    assertEquals(isTupleOf(predRest, predTup)("a"), false, "Not an array");
    assertEquals(
      isTupleOf(predRest, predTup)([0, "a"]),
      false,
      "Less than `predTup.length`",
    );
    assertEquals(
      isTupleOf(predRest, predTup)([0, 1, 2]),
      false,
      "Not match `predTup` and no rest elements",
    );
    assertEquals(
      isTupleOf(predRest, predTup)([0, 1, 2, 0, 1, 2]),
      false,
      "Not match `predTup` and `predRest`",
    );
    assertEquals(
      isTupleOf(predRest, predTup)([0, 1, 2, 0, "a", true]),
      false,
      "Match `predTup` but not match `predRest`",
    );
    assertEquals(
      isTupleOf(predRest, predTup)(["a", "b", "c", 0, "a", "b"]),
      false,
      "Match `predRest` but not match `predTup`",
    );
  });

  await t.step("predicated type is correct", () => {
    const predRest = is.ArrayOf(is.Number);
    const predTup = [is.Number, is.String, is.Boolean] as const;
    const a: unknown = [0, 1, 2, 0, "a", true];
    if (isTupleOf(predRest, predTup)(a)) {
      assertType<IsExact<typeof a, [...number[], number, string, boolean]>>(
        true,
      );
    }
  });
});

Deno.test("isTupleOf<T, R, L>", async (t) => {
  await t.step("returns properly named predicate function", async (t) => {
    await assertSnapshot(
      t,
      isTupleOf(
        [is.Number, is.String, is.Boolean],
        is.Array,
        [is.String, is.Boolean, is.Number],
      ).name,
    );
    await assertSnapshot(
      t,
      isTupleOf(
        [(_x): _x is string => false],
        is.ArrayOf(is.String),
        [(_x): _x is string => false],
      ).name,
    );
    await assertSnapshot(
      t,
      isTupleOf([
        isTupleOf(
          [
            isTupleOf(
              [is.Number, is.String, is.Boolean],
              is.ArrayOf(is.String),
              [is.String, is.Boolean, is.Number],
            ),
          ],
          is.Array,
          [
            isTupleOf(
              [is.Number, is.String, is.Boolean],
              is.ArrayOf(is.Number),
              [is.Number, is.Boolean, is.String],
            ),
          ],
        ),
      ]).name,
    );
  });

  await t.step("returns true on T tuple", () => {
    const predTup = [is.Number, is.String, is.Boolean] as const;
    const predRest = is.ArrayOf(is.Number);
    const predTrail = [is.Number, is.String, is.Boolean] as const;
    assertEquals(
      isTupleOf(predTup, predRest, predTrail)([0, "a", true, 0, "a", true]),
      true,
    );
    assertEquals(
      isTupleOf(predTup, predRest, predTrail)(
        [0, "a", true, 0, 1, 2, 0, "a", true],
      ),
      true,
    );
  });

  await t.step("returns false on non T tuple", () => {
    const predTup = [is.Number, is.String, is.Boolean] as const;
    const predRest = is.ArrayOf(is.String);
    const predTrail = [is.Number, is.String, is.Boolean] as const;
    assertEquals(
      isTupleOf(predTup, predRest, predTrail)("a"),
      false,
      "Not an array",
    );
    assertEquals(
      isTupleOf(predTup, predRest, predTrail)([0, "a", true, 0, "a"]),
      false,
      "Less than `predTup.length + predTrail.length`",
    );
    assertEquals(
      isTupleOf(predTup, predRest, predTrail)([0, 1, 2, 0, 1, 2, 0, 1, 2]),
      false,
      "Not match `predTup`, `predRest` and `predTrail`",
    );
    assertEquals(
      isTupleOf(predTup, predRest, predTrail)([0, "a", true, 0, "a", "b"]),
      false,
      "Match `predTup` but not match `predTrail` and no rest elements",
    );
    assertEquals(
      isTupleOf(predTup, predRest, predTrail)([0, "a", "b", 0, "a", true]),
      false,
      "Match `predTrail` but not match `predTup` and no rest elements",
    );
    assertEquals(
      isTupleOf(predTup, predRest, predTrail)(
        [0, "a", true, 0, 1, 2, 0, "a", true],
      ),
      false,
      "Match `predTup` and `predTrail` but not match `predRest`",
    );
    assertEquals(
      isTupleOf(predTup, predRest, predTrail)(
        [0, "a", true, "a", "b", "c", 0, "a", "b"],
      ),
      false,
      "Match `predTup` and `predRest` but not match `predTrail`",
    );
    assertEquals(
      isTupleOf(predTup, predRest, predTrail)(
        [0, "a", "b", "a", "b", "c", 0, "a", true],
      ),
      false,
      "Match `predRest` and `predTrail` but not match `predTup`",
    );
  });

  await t.step("predicated type is correct", () => {
    const predTup = [is.Number, is.String, is.Boolean] as const;
    const predRest = is.ArrayOf(is.Number);
    const predTrail = [is.Number, is.Boolean] as const;
    const a: unknown = [0, "a", true, 0, 1, 2, 0, true];
    if (isTupleOf(predTup, predRest, predTrail)(a)) {
      assertType<
        IsExact<
          typeof a,
          [number, string, boolean, ...number[], number, boolean]
        >
      >(
        true,
      );
    }
  });
});
