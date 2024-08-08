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
      "Undefined properties are ignored",
    );
    assertEquals(
      isObjectOf(predObj)(
        Object.assign(() => void 0, { a: 0, b: "a", c: true }),
      ),
      true,
      "Function are treated as an object",
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

  await t.step(
    "does not affect prototype properties of 'predObj'",
    async (t) => {
      const prototypeObj = {
        a: is.Number,
        b: is.Boolean,
      };
      // deno-lint-ignore ban-types
      const predObj = Object.assign(Object.create(prototypeObj) as {}, {
        c: is.String,
      });

      await t.step("returns true on T object", () => {
        assertEquals(isObjectOf(predObj)({ c: "a" }), true);
        assertEquals(
          isObjectOf(predObj)({ a: "ignored", b: "ignored", c: "a" }),
          true,
          "Predicates defined in the prototype are ignored",
        );
        assertEquals(
          isObjectOf(predObj)({ c: "a", d: "ignored" }),
          true,
          "Undefined properties are ignored",
        );
        assertEquals(
          isObjectOf(predObj)(Object.assign(() => void 0, { c: "a" })),
          true,
          "Function are treated as an object",
        );
      });

      await t.step("returns false on non T object", () => {
        assertEquals(isObjectOf(predObj)("a"), false, "Value is not an object");
        assertEquals(
          isObjectOf(predObj)({ a: 0, b: true, c: 1 }),
          false,
          "Object have a different type property",
        );
        assertEquals(
          isObjectOf(predObj)({ a: 0, b: true }),
          false,
          "Object does not have one property",
        );
        assertEquals(
          isObjectOf({ 0: is.String })(["a"]),
          false,
          "Value is not an object",
        );
      });
    },
  );

  await t.step("with symbol properties", async (t) => {
    const s = Symbol("s");
    const predObj = {
      a: is.Number,
      b: is.String,
      [s]: is.Boolean,
    };

    await t.step("returns properly named predicate function", async (t) => {
      await assertSnapshot(t, isObjectOf(predObj).name);
      await assertSnapshot(
        t,
        isObjectOf({
          [Symbol("a")]: isObjectOf({
            [Symbol("b")]: isObjectOf({ [Symbol("c")]: is.Boolean }),
          }),
        }).name,
      );
    });

    await t.step("returns true on T object", () => {
      assertEquals(isObjectOf(predObj)({ a: 0, b: "a", [s]: true }), true);
      assertEquals(
        isObjectOf(predObj)({ a: 0, b: "a", [s]: true, d: "ignored" }),
        true,
        "Undefined properties are ignored",
      );
      assertEquals(
        isObjectOf(predObj)({
          a: 0,
          b: "a",
          [s]: true,
          [Symbol("t")]: "ignored",
        }),
        true,
        "Undefined symbol properties are ignored",
      );
      assertEquals(
        isObjectOf(predObj)(
          Object.assign(() => void 0, { a: 0, b: "a", [s]: true }),
        ),
        true,
        "Function are treated as an object",
      );
    });

    await t.step("returns false on non T object", () => {
      assertEquals(isObjectOf(predObj)("a"), false, "Value is not an object");
      assertEquals(
        isObjectOf(predObj)({ a: 0, b: "a", [s]: "" }),
        false,
        "Object have a different type symbol property",
      );
      assertEquals(
        isObjectOf(predObj)({ a: 0, b: "a" }),
        false,
        "Object does not have symbol property",
      );
      const arrayWithSymbolProp = ["ignored"];
      // deno-lint-ignore no-explicit-any
      (arrayWithSymbolProp as any)[s] = true;
      assertEquals(
        isObjectOf({ [s]: is.Boolean })(arrayWithSymbolProp),
        false,
        "Value is not an object",
      );
    });

    await t.step("predicated type is correct", () => {
      const a = Symbol("a");
      const b = Symbol("b");
      const c = Symbol("c");
      const d = Symbol("d");
      const e = Symbol("e");
      const f = Symbol("f");
      const predObj2 = {
        [a]: as.Readonly(as.Optional(is.String)),
        [b]: as.Optional(as.Readonly(is.String)),
        [c]: as.Readonly(is.String),
        [d]: as.Optional(is.String),
        [e]: as.Unreadonly(as.Unoptional(as.Readonly(as.Optional(is.String)))),
        [f]: as.Unoptional(as.Unreadonly(as.Optional(as.Readonly(is.String)))),
      };
      const x: unknown = {};

      if (isObjectOf(predObj)(x)) {
        assertType<
          Equal<
            typeof x,
            {
              a: number;
              b: string;
              [s]: boolean;
            }
          >
        >(true);
      }

      if (isObjectOf(predObj2)(x)) {
        assertType<
          Equal<
            typeof x,
            {
              readonly [a]?: string;
              readonly [b]?: string;
              readonly [c]: string;
              [d]?: string;
              [e]: string;
              [f]: string;
            }
          >
        >(true);
      }
    });
  });
});
