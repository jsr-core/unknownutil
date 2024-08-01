import { assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { assertType } from "@std/testing/types";
import { type Equal, testWithExamples } from "../_testutil.ts";
import { is } from "./mod.ts";
import { as } from "../as/mod.ts";
import { isObjectOf } from "./object_of.ts";

Deno.test("isObjectOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(
      t,
      isObjectOf({ a: is.Number, b: is.String, c: is.Boolean }).name,
    );
    await assertSnapshot(
      t,
      isObjectOf({ a: (_x): _x is string => false }).name,
    );
    // Nested
    await assertSnapshot(
      t,
      isObjectOf({ a: isObjectOf({ b: isObjectOf({ c: is.Boolean }) }) }).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const predObj = {
      a: is.Number,
      b: is.String,
      c: is.Boolean,
    };
    const a: unknown = { a: 0, b: "a", c: true };
    if (isObjectOf(predObj)(a)) {
      assertType<Equal<typeof a, { a: number; b: string; c: boolean }>>(true);
    }
  });
  await t.step("returns true on T object", () => {
    const predObj = {
      a: is.Number,
      b: is.String,
      c: is.Boolean,
    };
    assertEquals(isObjectOf(predObj)({ a: 0, b: "a", c: true }), true);
    assertEquals(
      isObjectOf(predObj)({ a: 0, b: "a", c: true, d: "ignored" }),
      true,
      "Object have an unknown property",
    );
    assertEquals(
      isObjectOf(predObj)(
        Object.assign(() => void 0, { a: 0, b: "a", c: true }),
      ),
      true,
      "Function object",
    );
  });
  await t.step("returns false on non T object", () => {
    const predObj = {
      a: is.Number,
      b: is.String,
      c: is.Boolean,
    };
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
    assertEquals(isObjectOf(predObj)(date), true, "Value is not an object");
  });
  await t.step("with asOptional/asReadonly", () => {
    const predObj = {
      a: as.Readonly(as.Optional(is.String)),
      b: as.Optional(as.Readonly(is.String)),
      c: as.Readonly(is.String),
      d: as.Optional(is.String),
      e: as.Unreadonly(as.Unoptional(as.Readonly(as.Optional(is.String)))),
      f: as.Unoptional(as.Unreadonly(as.Optional(as.Readonly(is.String)))),
    };
    const a: unknown = undefined;
    if (isObjectOf(predObj)(a)) {
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
  await testWithExamples(
    t,
    isObjectOf({ a: (_: unknown): _ is unknown => false }),
    { excludeExamples: ["record"] },
  );
});
