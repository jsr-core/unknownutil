import { assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { assertType } from "@std/testing/types";
import type { Equal } from "../_testutil.ts";
import { is } from "./mod.ts";
import { as } from "../as/mod.ts";
import { isObjectOf } from "./object_of.ts";

Deno.test("isObjectOf<T>", async (t) => {
  const predObj = {
    a: is.Number,
    b: is.String,
    c: is.Boolean,
  };

  await t.step("returns properly named predicate function", async (t) => {
    assertEquals(typeof isObjectOf({}), "function");
    await assertSnapshot(t, isObjectOf(predObj).name);
    await assertSnapshot(
      t,
      isObjectOf({ a: (_x): _x is string => false }).name,
    );
    await assertSnapshot(
      t,
      isObjectOf({ a: isObjectOf({ b: isObjectOf({ c: is.Boolean }) }) }).name,
    );
  });

  await t.step("returns true on T object", () => {
    assertEquals(isObjectOf(predObj)({ a: 0, b: "a", c: true }), true);
    assertEquals(
      isObjectOf(predObj)({ a: 0, b: "a", c: true, d: "ignored" }),
      true,
    );
    assertEquals(
      isObjectOf(predObj)(
        Object.assign(() => void 0, { a: 0, b: "a", c: true }),
      ),
      true,
    );
  });

  await t.step("returns false on non T object", () => {
    assertEquals(isObjectOf(predObj)("a"), false, "Value is not an object");
    assertEquals(
      isObjectOf(predObj)({ a: 0, b: "a", c: "" }),
      false,
      "Object have a different type property",
    );
    assertEquals(
      isObjectOf(predObj)({ a: 0, b: "a" }),
      false,
      "Object does not have one property",
    );
    assertEquals(
      isObjectOf({ 0: is.String })(["a"]),
      false,
      "Value is not an object",
    );
  });

  await t.step("returns true on T instance", () => {
    const date = new Date();
    const predObj = {
      getFullYear: is.Function,
    };
    assertEquals(isObjectOf(predObj)(date), true);
  });

  await t.step("predicated type is correct", () => {
    const predObj2 = {
      a: as.Readonly(as.Optional(is.String)),
      b: as.Optional(as.Readonly(is.String)),
      c: as.Readonly(is.String),
      d: as.Optional(is.String),
      e: as.Unreadonly(as.Unoptional(as.Readonly(as.Optional(is.String)))),
      f: as.Unoptional(as.Unreadonly(as.Optional(as.Readonly(is.String)))),
    };
    const a: unknown = { a: 0, b: "a", c: true };

    if (isObjectOf(predObj)(a)) {
      assertType<Equal<typeof a, { a: number; b: string; c: boolean }>>(true);
    }

    if (isObjectOf(predObj2)(a)) {
      assertType<
        Equal<
          typeof a,
          {
            readonly a?: string;
            readonly b?: string;
            readonly c: string;
            d?: string;
            e: string;
            f: string;
          }
        >
      >(true);
    }
  });

  await t.step("if 'predObj' has prototype properties", async (t) => {
    const prototypeObj = {
      a: is.Number,
      b: is.Boolean,
    };
    // deno-lint-ignore ban-types
    const predObj2 = Object.assign(Object.create(prototypeObj) as {}, {
      c: is.String,
    });

    await t.step("returns true on T object that omits prototype", () => {
      assertEquals(isObjectOf(predObj2)({ c: "a" }), true);
      assertEquals(
        isObjectOf(predObj2)({ c: "a", d: "ignored" }),
        true,
      );
      assertEquals(
        isObjectOf(predObj2)(Object.assign(() => void 0, { c: "a" })),
        true,
      );
    });

    await t.step("returns false on non T object that omits prototype", () => {
      assertEquals(isObjectOf(predObj2)("a"), false, "Value is not an object");
      assertEquals(
        isObjectOf(predObj2)({ a: 0, b: true, c: 1 }),
        false,
        "Object have a different type property",
      );
      assertEquals(
        isObjectOf(predObj2)({ a: 0, b: true }),
        false,
        "Object does not have one property",
      );
      assertEquals(
        isObjectOf({ 0: is.String })(["a"]),
        false,
        "Value is not an object",
      );
    });
  });
});
