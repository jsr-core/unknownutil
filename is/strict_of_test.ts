import { assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { assertType } from "@std/testing/types";
import { type Equal, testWithExamples } from "../_testutil.ts";
import { as } from "../as/mod.ts";
import { is } from "./mod.ts";
import { isStrictOf } from "./strict_of.ts";

Deno.test("isStrictOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(
      t,
      isStrictOf(is.ObjectOf({ a: is.Number, b: is.String, c: is.Boolean }))
        .name,
    );
    await assertSnapshot(
      t,
      isStrictOf(is.ObjectOf({ a: (_x): _x is string => false })).name,
    );
    // Nested
    await assertSnapshot(
      t,
      isStrictOf(
        is.ObjectOf({
          a: isStrictOf(
            is.ObjectOf({ b: isStrictOf(is.ObjectOf({ c: is.Boolean })) }),
          ),
        }),
      ).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const predObj = {
      a: is.Number,
      b: is.String,
      c: is.Boolean,
    };
    const a: unknown = { a: 0, b: "a", c: true };
    if (isStrictOf(is.ObjectOf(predObj))(a)) {
      assertType<Equal<typeof a, { a: number; b: string; c: boolean }>>(true);
    }
  });
  await t.step("returns true on T object", () => {
    const predObj = {
      a: is.Number,
      b: is.String,
      c: is.Boolean,
    };
    assertEquals(
      isStrictOf(is.ObjectOf(predObj))({ a: 0, b: "a", c: true }),
      true,
    );
  });
  await t.step("returns false on non T object", () => {
    const predObj = {
      a: is.Number,
      b: is.String,
      c: is.Boolean,
    };
    assertEquals(
      isStrictOf(is.ObjectOf(predObj))({ a: 0, b: "a", c: "" }),
      false,
      "Object have a different type property",
    );
    assertEquals(
      isStrictOf(is.ObjectOf(predObj))({ a: 0, b: "a" }),
      false,
      "Object does not have one property",
    );
    assertEquals(
      isStrictOf(is.ObjectOf(predObj))({
        a: 0,
        b: "a",
        c: true,
        d: "invalid",
      }),
      false,
      "Object have an unknown property",
    );
  });
  await testWithExamples(
    t,
    isStrictOf(is.ObjectOf({ a: (_: unknown): _ is unknown => false })),
    { excludeExamples: ["record"] },
  );
  await t.step("with optional properties", async (t) => {
    await t.step("returns proper type predicate", () => {
      const predObj = {
        a: is.Number,
        b: is.UnionOf([is.String, is.Undefined]),
        c: as.Optional(is.Boolean),
      };
      const a: unknown = { a: 0, b: "a" };
      if (isStrictOf(is.ObjectOf(predObj))(a)) {
        assertType<
          Equal<typeof a, { a: number; b: string | undefined; c?: boolean }>
        >(true);
      }
    });
    await t.step("returns true on T object", () => {
      const predObj = {
        a: is.Number,
        b: is.UnionOf([is.String, is.Undefined]),
        c: as.Optional(is.Boolean),
      };
      assertEquals(
        isStrictOf(is.ObjectOf(predObj))({ a: 0, b: "a", c: true }),
        true,
      );
      assertEquals(
        isStrictOf(is.ObjectOf(predObj))({ a: 0, b: "a" }),
        true,
        "Object does not have an optional property",
      );
      assertEquals(
        isStrictOf(is.ObjectOf(predObj))({ a: 0, b: "a", c: undefined }),
        true,
        "Object has `undefined` as value of optional property",
      );
    });
    await t.step("returns false on non T object", () => {
      const predObj = {
        a: is.Number,
        b: is.UnionOf([is.String, is.Undefined]),
        c: as.Optional(is.Boolean),
      };
      assertEquals(
        isStrictOf(is.ObjectOf(predObj))({ a: 0, b: "a", c: "" }),
        false,
        "Object have a different type property",
      );
      assertEquals(
        isStrictOf(is.ObjectOf(predObj))({ a: 0, b: "a", c: null }),
        false,
        "Object has `null` as value of optional property",
      );
      assertEquals(
        isStrictOf(is.ObjectOf(predObj))({
          a: 0,
          b: "a",
          c: true,
          d: "invalid",
        }),
        false,
        "Object have an unknown property",
      );
      assertEquals(
        isStrictOf(is.ObjectOf(predObj))({
          a: 0,
          b: "a",
          d: "invalid",
        }),
        false,
        "Object have the same number of properties but an unknown property exists",
      );
    });
  });
});
