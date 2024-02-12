import {
  assertEquals,
  assertStrictEquals,
} from "https://deno.land/std@0.211.0/assert/mod.ts";
import {
  assertSnapshot,
} from "https://deno.land/std@0.211.0/testing/snapshot.ts";
import { assertType } from "https://deno.land/std@0.211.0/testing/types.ts";
import { type Equal, stringify } from "./_testutil.ts";
import { type Predicate, type PredicateType } from "./type.ts";
import {
  isArray,
  isAsyncFunction,
  isBigInt,
  isBoolean,
  isFunction,
  isNull,
  isNumber,
  isRecord,
  isSet,
  isString,
  isSymbol,
  isSyncFunction,
  isUndefined,
} from "./core.ts";
import { isObjectOf } from "./factory.ts";
import is, {
  isAllOf,
  isOneOf,
  isOptionalOf,
  isPartialOf,
  isPickOf,
  isStrictOf,
} from "./utility.ts";

const examples = {
  string: ["", "Hello world"],
  number: [0, 1234567890],
  bigint: [0n, 1234567890n],
  boolean: [true, false],
  array: [[], [0, 1, 2], ["a", "b", "c"], [0, "a", true]],
  set: [new Set(), new Set([0, 1, 2]), new Set(["a", "b", "c"])],
  record: [{}, { a: 0, b: 1, c: 2 }, { a: "a", b: "b", c: "c" }],
  map: [
    new Map(),
    new Map([["a", 0], ["b", 1], ["c", 2]]),
    new Map([["a", "a"], ["b", "b"], ["c", "c"]]),
  ],
  syncFunction: [function a() {}, () => {}],
  asyncFunction: [async function b() {}, async () => {}],
  null: [null],
  undefined: [undefined],
  symbol: [Symbol("a"), Symbol("b"), Symbol("c")],
  date: [new Date(1690248225000), new Date(0)],
  promise: [new Promise(() => {})],
} as const;

async function testWithExamples<T>(
  t: Deno.TestContext,
  pred: Predicate<T>,
  opts?: {
    validExamples?: (keyof typeof examples)[];
    excludeExamples?: (keyof typeof examples)[];
  },
): Promise<void> {
  const { validExamples = [], excludeExamples = [] } = opts ?? {};
  const exampleEntries = (Object.entries(examples) as unknown as [
    name: keyof typeof examples,
    example: unknown[],
  ][]).filter(([k]) => !excludeExamples.includes(k));
  for (const [name, example] of exampleEntries) {
    const expect = validExamples.includes(name);
    for (const v of example) {
      await t.step(
        `returns ${expect} on ${stringify(v)}`,
        () => {
          assertEquals(pred(v), expect);
        },
      );
    }
  }
}

Deno.test("isOneOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isOneOf([isNumber, isString, isBoolean]).name);
  });
  await t.step("returns proper type predicate", () => {
    const preds = [isNumber, isString, isBoolean] as const;
    const a: unknown = [0, "a", true];
    if (isOneOf(preds)(a)) {
      assertType<Equal<typeof a, number | string | boolean>>(true);
    }
  });
  await t.step("returns proper type predicate (#49)", () => {
    const isFoo = isObjectOf({ foo: isString });
    const isBar = isObjectOf({ foo: isString, bar: isNumber });
    type Foo = PredicateType<typeof isFoo>;
    type Bar = PredicateType<typeof isBar>;
    const preds = [isFoo, isBar] as const;
    const a: unknown = [0, "a", true];
    if (isOneOf(preds)(a)) {
      assertType<Equal<typeof a, Foo | Bar>>(true);
    }
  });
  await t.step("returns true on one of T", () => {
    const preds = [isNumber, isString, isBoolean] as const;
    assertEquals(isOneOf(preds)(0), true);
    assertEquals(isOneOf(preds)("a"), true);
    assertEquals(isOneOf(preds)(true), true);
  });
  await t.step("returns false on non of T", async (t) => {
    const preds = [isNumber, isString, isBoolean] as const;
    await testWithExamples(t, isOneOf(preds), {
      excludeExamples: ["number", "string", "boolean"],
    });
  });
});

Deno.test("isAllOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(
      t,
      isAllOf([
        isObjectOf({ a: isNumber }),
        isObjectOf({ b: isString }),
      ]).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const preds = [
      isObjectOf({ a: isNumber }),
      isObjectOf({ b: isString }),
    ] as const;
    const a: unknown = { a: 0, b: "a" };
    if (isAllOf(preds)(a)) {
      assertType<Equal<typeof a, { a: number } & { b: string }>>(true);
    }
  });
  await t.step("returns true on all of T", () => {
    const preds = [
      isObjectOf({ a: isNumber }),
      isObjectOf({ b: isString }),
    ] as const;
    assertEquals(isAllOf(preds)({ a: 0, b: "a" }), true);
  });
  await t.step("returns false on non of T", async (t) => {
    const preds = [
      isObjectOf({ a: isNumber }),
      isObjectOf({ b: isString }),
    ] as const;
    assertEquals(
      isAllOf(preds)({ a: 0, b: 0 }),
      false,
      "Some properties has wrong type",
    );
    assertEquals(
      isAllOf(preds)({ a: 0 }),
      false,
      "Some properties does not exists",
    );
    await testWithExamples(t, isAllOf(preds), {
      excludeExamples: ["record"],
    });
  });
});

Deno.test("isOptionalOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isOptionalOf(isNumber).name);
    // Nesting does nothing
    await assertSnapshot(t, isOptionalOf(isOptionalOf(isNumber)).name);
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = undefined;
    if (isOptionalOf(isNumber)(a)) {
      assertType<Equal<typeof a, number | undefined>>(true);
    }
  });
  await t.step("with isString", async (t) => {
    await testWithExamples(t, isOptionalOf(isString), {
      validExamples: ["string", "undefined"],
    });
  });
  await t.step("with isNumber", async (t) => {
    await testWithExamples(t, isOptionalOf(isNumber), {
      validExamples: ["number", "undefined"],
    });
  });
  await t.step("with isBigInt", async (t) => {
    await testWithExamples(t, isOptionalOf(isBigInt), {
      validExamples: ["bigint", "undefined"],
    });
  });
  await t.step("with isBoolean", async (t) => {
    await testWithExamples(t, isOptionalOf(isBoolean), {
      validExamples: ["boolean", "undefined"],
    });
  });
  await t.step("with isArray", async (t) => {
    await testWithExamples(t, isOptionalOf(isArray), {
      validExamples: ["array", "undefined"],
    });
  });
  await t.step("with isSet", async (t) => {
    await testWithExamples(t, isOptionalOf(isSet), {
      validExamples: ["set", "undefined"],
    });
  });
  await t.step("with isRecord", async (t) => {
    await testWithExamples(t, isOptionalOf(isRecord), {
      validExamples: ["record", "undefined"],
    });
  });
  await t.step("with isFunction", async (t) => {
    await testWithExamples(t, isOptionalOf(isFunction), {
      validExamples: ["syncFunction", "asyncFunction", "undefined"],
    });
  });
  await t.step("with isSyncFunction", async (t) => {
    await testWithExamples(t, isOptionalOf(isSyncFunction), {
      validExamples: ["syncFunction", "undefined"],
    });
  });
  await t.step("with isAsyncFunction", async (t) => {
    await testWithExamples(t, isOptionalOf(isAsyncFunction), {
      validExamples: ["asyncFunction", "undefined"],
    });
  });
  await t.step("with isNull", async (t) => {
    await testWithExamples(t, isOptionalOf(isNull), {
      validExamples: ["null", "undefined"],
    });
  });
  await t.step("with isUndefined", async (t) => {
    await testWithExamples(t, isOptionalOf(isUndefined), {
      validExamples: ["undefined"],
    });
  });
  await t.step("with isSymbol", async (t) => {
    await testWithExamples(t, isOptionalOf(isSymbol), {
      validExamples: ["symbol", "undefined"],
    });
  });
});

Deno.test("isStrictOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(
      t,
      isStrictOf(isObjectOf({ a: isNumber, b: isString, c: isBoolean })).name,
    );
    await assertSnapshot(
      t,
      isStrictOf(isObjectOf({ a: (_x): _x is string => false })).name,
    );
    // Nested
    await assertSnapshot(
      t,
      isStrictOf(
        isObjectOf({
          a: isStrictOf(
            isObjectOf({ b: isStrictOf(isObjectOf({ c: isBoolean })) }),
          ),
        }),
      ).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const predObj = {
      a: isNumber,
      b: isString,
      c: isBoolean,
    };
    const a: unknown = { a: 0, b: "a", c: true };
    if (isStrictOf(isObjectOf(predObj))(a)) {
      assertType<Equal<typeof a, { a: number; b: string; c: boolean }>>(true);
    }
  });
  await t.step("returns true on T object", () => {
    const predObj = {
      a: isNumber,
      b: isString,
      c: isBoolean,
    };
    assertEquals(
      isStrictOf(isObjectOf(predObj))({ a: 0, b: "a", c: true }),
      true,
    );
  });
  await t.step("returns false on non T object", () => {
    const predObj = {
      a: isNumber,
      b: isString,
      c: isBoolean,
    };
    assertEquals(
      isStrictOf(isObjectOf(predObj))({ a: 0, b: "a", c: "" }),
      false,
      "Object have a different type property",
    );
    assertEquals(
      isStrictOf(isObjectOf(predObj))({ a: 0, b: "a" }),
      false,
      "Object does not have one property",
    );
    assertEquals(
      isStrictOf(isObjectOf(predObj))({
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
    isStrictOf(isObjectOf({ a: (_: unknown): _ is unknown => false })),
    { excludeExamples: ["record"] },
  );
  await t.step("with optional properties", async (t) => {
    await t.step("returns proper type predicate", () => {
      const predObj = {
        a: isNumber,
        b: isOneOf([isString, isUndefined]),
        c: isOptionalOf(isBoolean),
      };
      const a: unknown = { a: 0, b: "a" };
      if (isStrictOf(isObjectOf(predObj))(a)) {
        assertType<
          Equal<typeof a, { a: number; b: string | undefined; c?: boolean }>
        >(true);
      }
    });
    await t.step("returns true on T object", () => {
      const predObj = {
        a: isNumber,
        b: isOneOf([isString, isUndefined]),
        c: isOptionalOf(isBoolean),
      };
      assertEquals(
        isStrictOf(isObjectOf(predObj))({ a: 0, b: "a", c: true }),
        true,
      );
      assertEquals(
        isStrictOf(isObjectOf(predObj))({ a: 0, b: "a" }),
        true,
        "Object does not have an optional property",
      );
      assertEquals(
        isStrictOf(isObjectOf(predObj))({ a: 0, b: "a", c: undefined }),
        true,
        "Object has `undefined` as value of optional property",
      );
    });
    await t.step("returns false on non T object", () => {
      const predObj = {
        a: isNumber,
        b: isOneOf([isString, isUndefined]),
        c: isOptionalOf(isBoolean),
      };
      assertEquals(
        isStrictOf(isObjectOf(predObj))({ a: 0, b: "a", c: "" }),
        false,
        "Object have a different type property",
      );
      assertEquals(
        isStrictOf(isObjectOf(predObj))({ a: 0, b: "a", c: null }),
        false,
        "Object has `null` as value of optional property",
      );
      assertEquals(
        isStrictOf(isObjectOf(predObj))({
          a: 0,
          b: "a",
          c: true,
          d: "invalid",
        }),
        false,
        "Object have an unknown property",
      );
      assertEquals(
        isStrictOf(isObjectOf(predObj))({
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

Deno.test("isPartialOf<T>", async (t) => {
  const pred = isObjectOf({
    a: isNumber,
    b: isString,
    c: isBoolean,
  });
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isPartialOf(pred).name);
    // Nestable (no effect)
    await assertSnapshot(t, isPartialOf(isPartialOf(pred)).name);
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = { a: 0, b: "a", c: true };
    if (isPartialOf(pred)(a)) {
      assertType<
        Equal<typeof a, Partial<{ a: number; b: string; c: boolean }>>
      >(true);
    }
  });
  await t.step("returns true on Partial<T> object", () => {
    assertEquals(
      isPartialOf(pred)({ a: undefined, b: undefined, c: undefined }),
      true,
    );
    assertEquals(isPartialOf(pred)({}), true);
  });
  await t.step("returns false on non Partial<T> object", () => {
    assertEquals(isPartialOf(pred)("a"), false, "Value is not an object");
    assertEquals(
      isPartialOf(pred)({ a: 0, b: "a", c: "" }),
      false,
      "Object have a different type property",
    );
  });
});

Deno.test("isPickOf<T, K>", async (t) => {
  const pred = isObjectOf({
    a: isNumber,
    b: isString,
    c: isBoolean,
  });
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isPickOf(pred, ["a", "c"]).name);
    // Nestable
    await assertSnapshot(t, isPickOf(isPickOf(pred, ["a", "c"]), ["a"]).name);
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = { a: 0, b: "a", c: true };
    if (isPickOf(pred, ["a", "c"])(a)) {
      assertType<
        Equal<typeof a, { a: number; c: boolean }>
      >(true);
    }
    if (isPickOf(isPickOf(pred, ["a", "c"]), ["a"])(a)) {
      assertType<
        Equal<typeof a, { a: number }>
      >(true);
    }
  });
  await t.step("returns true on Pick<T, K> object", () => {
    assertEquals(
      isPickOf(pred, ["a", "c"])({ a: 0, b: undefined, c: true }),
      true,
    );
    assertEquals(isPickOf(pred, ["a"])({ a: 0 }), true);
  });
  await t.step("returns false on non Pick<T, K> object", () => {
    assertEquals(
      isPickOf(pred, ["a", "c"])("a"),
      false,
      "Value is not an object",
    );
    assertEquals(
      isPickOf(pred, ["a", "c"])({ a: 0, b: "a", c: "" }),
      false,
      "Object have a different type property",
    );
  });
});

Deno.test("is", async (t) => {
  const mod = await import("./utility.ts");
  const casesOfAliasAndIsFunction = Object.entries(mod)
    .filter(([k, _]) => k.startsWith("is"))
    .map(([k, v]) => [k.slice(2), v] as const);
  for (const [alias, fn] of casesOfAliasAndIsFunction) {
    await t.step(`defines \`${alias}\` function`, () => {
      assertStrictEquals(is[alias as keyof typeof is], fn);
    });
  }
  await t.step(
    "only has entries that are the same as the `is*` function aliases",
    () => {
      const aliases = casesOfAliasAndIsFunction.map(([a]) => a).sort();
      assertEquals(Object.keys(is).sort(), aliases);
    },
  );
});
