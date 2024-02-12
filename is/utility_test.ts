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
import { isOptionalOf } from "./annotation.ts";
import { isBoolean, isNumber, isString, isUndefined } from "./core.ts";
import { isObjectOf } from "./factory.ts";
import is, {
  isIntersectionOf,
  isOmitOf,
  isPartialOf,
  isPickOf,
  isRequiredOf,
  isUnionOf,
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

Deno.test("isUnionOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isUnionOf([isNumber, isString, isBoolean]).name);
  });
  await t.step("returns proper type predicate", () => {
    const preds = [isNumber, isString, isBoolean] as const;
    const a: unknown = [0, "a", true];
    if (isUnionOf(preds)(a)) {
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
    if (isUnionOf(preds)(a)) {
      assertType<Equal<typeof a, Foo | Bar>>(true);
    }
  });
  await t.step("returns true on one of T", () => {
    const preds = [isNumber, isString, isBoolean] as const;
    assertEquals(isUnionOf(preds)(0), true);
    assertEquals(isUnionOf(preds)("a"), true);
    assertEquals(isUnionOf(preds)(true), true);
  });
  await t.step("returns false on non of T", async (t) => {
    const preds = [isNumber, isString, isBoolean] as const;
    await testWithExamples(t, isUnionOf(preds), {
      excludeExamples: ["number", "string", "boolean"],
    });
  });
});

Deno.test("isIntersectionOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(
      t,
      isIntersectionOf([
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
    if (isIntersectionOf(preds)(a)) {
      assertType<Equal<typeof a, { a: number } & { b: string }>>(true);
    }
  });
  await t.step("returns true on all of T", () => {
    const preds = [
      isObjectOf({ a: isNumber }),
      isObjectOf({ b: isString }),
    ] as const;
    assertEquals(isIntersectionOf(preds)({ a: 0, b: "a" }), true);
  });
  await t.step("returns false on non of T", async (t) => {
    const preds = [
      isObjectOf({ a: isNumber }),
      isObjectOf({ b: isString }),
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
});

Deno.test("isRequiredOf<T>", async (t) => {
  const pred = isObjectOf({
    a: isNumber,
    b: isUnionOf([isString, isUndefined]),
    c: isOptionalOf(isBoolean),
  });
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isRequiredOf(pred).name);
    // Nestable (no effect)
    await assertSnapshot(t, isRequiredOf(isRequiredOf(pred)).name);
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = { a: 0, b: "a", c: true };
    if (isRequiredOf(pred)(a)) {
      assertType<
        Equal<typeof a, { a: number; b: string | undefined; c: boolean }>
      >(true);
    }
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
});

Deno.test("isPartialOf<T>", async (t) => {
  const pred = isObjectOf({
    a: isNumber,
    b: isUnionOf([isString, isUndefined]),
    c: isOptionalOf(isBoolean),
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

Deno.test("isOmitOf<T, K>", async (t) => {
  const pred = isObjectOf({
    a: isNumber,
    b: isString,
    c: isBoolean,
  });
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isOmitOf(pred, ["b"]).name);
    // Nestable
    await assertSnapshot(t, isOmitOf(isOmitOf(pred, ["b"]), ["c"]).name);
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = { a: 0, b: "a", c: true };
    if (isOmitOf(pred, ["b"])(a)) {
      assertType<
        Equal<typeof a, { a: number; c: boolean }>
      >(true);
    }
    if (isOmitOf(isOmitOf(pred, ["b"]), ["c"])(a)) {
      assertType<
        Equal<typeof a, { a: number }>
      >(true);
    }
  });
  await t.step("returns true on Omit<T, K> object", () => {
    assertEquals(
      isOmitOf(pred, ["b"])({ a: 0, b: undefined, c: true }),
      true,
    );
    assertEquals(isOmitOf(pred, ["b", "c"])({ a: 0 }), true);
  });
  await t.step("returns false on non Omit<T, K> object", () => {
    assertEquals(
      isOmitOf(pred, ["b"])("a"),
      false,
      "Value is not an object",
    );
    assertEquals(
      isOmitOf(pred, ["b"])({ a: 0, b: "a", c: "" }),
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
