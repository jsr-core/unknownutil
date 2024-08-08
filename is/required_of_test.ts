import { assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { assertType } from "@std/testing/types";
import type { Equal } from "../_testutil.ts";
import { as } from "../as/mod.ts";
import { is } from "./mod.ts";
import { isRequiredOf } from "./required_of.ts";

Deno.test("isRequiredOf<T>", async (t) => {
  const pred = is.ObjectOf({
    a: is.Number,
    b: is.UnionOf([is.String, is.Undefined]),
    c: as.Optional(is.Boolean),
    d: as.Readonly(is.String),
  });
  await t.step("returns properly named predicate function", async (t) => {
    await assertSnapshot(t, isRequiredOf(pred).name);
    await assertSnapshot(t, isRequiredOf(isRequiredOf(pred)).name);
  });

  await t.step("returns true on Required<T> object", () => {
    assertEquals(
      isRequiredOf(pred)({ a: undefined, b: undefined, c: undefined }),
      false,
      "Object does not have required properties",
    );
    assertEquals(
      isRequiredOf(pred)({}),
      false,
      "Object does not have required properties",
    );
  });

  await t.step("returns false on non Required<T> object", () => {
    assertEquals(isRequiredOf(pred)("a"), false, "Value is not an object");
    assertEquals(
      isRequiredOf(pred)({ a: 0, b: "a", c: "" }),
      false,
      "Object have a different type property",
    );
  });

  await t.step("predicated type is correct", () => {
    const a: unknown = { a: 0, b: "a", c: true };
    if (isRequiredOf(pred)(a)) {
      assertType<
        Equal<
          typeof a,
          { a: number; b: string | undefined; c: boolean; readonly d: string }
        >
      >(true);
    }
  });

  await t.step("with symbol properties", async (t) => {
    const b = Symbol("b");
    const c = Symbol("c");
    const d = Symbol("d");
    const pred = is.ObjectOf({
      a: is.Number,
      [b]: is.UnionOf([is.String, is.Undefined]),
      [c]: as.Optional(is.Boolean),
      [d]: as.Readonly(is.String),
    });
    await t.step("returns properly named predicate function", async (t) => {
      await assertSnapshot(t, isRequiredOf(pred).name);
      await assertSnapshot(t, isRequiredOf(isRequiredOf(pred)).name);
    });

    await t.step("returns true on Required<T> object", () => {
      assertEquals(
        isRequiredOf(pred)({ a: undefined, [b]: undefined, [c]: undefined }),
        false,
        "Object does not have required properties",
      );
      assertEquals(
        isRequiredOf(pred)({}),
        false,
        "Object does not have required properties",
      );
    });

    await t.step("returns false on non Required<T> object", () => {
      assertEquals(isRequiredOf(pred)("a"), false, "Value is not an object");
      assertEquals(
        isRequiredOf(pred)({ a: 0, [b]: "a", [c]: "" }),
        false,
        "Object have a different type property",
      );
    });

    await t.step("predicated type is correct", () => {
      const a: unknown = { a: 0, [b]: "a", [c]: true };
      if (isRequiredOf(pred)(a)) {
        assertType<
          Equal<
            typeof a,
            {
              a: number;
              [b]: string | undefined;
              [c]: boolean;
              readonly [d]: string;
            }
          >
        >(true);
      }
    });
  });
});
