import {
  assertEquals,
  assertStrictEquals,
} from "https://deno.land/std@0.211.0/assert/mod.ts";
import {
  assertSnapshot,
} from "https://deno.land/std@0.211.0/testing/snapshot.ts";
import { assertType } from "https://deno.land/std@0.211.0/testing/types.ts";
import is, {
  isAllOf,
  isAny,
  isArray,
  isArrayOf,
  isAsyncFunction,
  isBigInt,
  isBoolean,
  isFunction,
  isInstanceOf,
  isLiteralOf,
  isLiteralOneOf,
  isNull,
  isNullish,
  isNumber,
  isObjectOf,
  isOneOf,
  isOptionalOf,
  isPrimitive,
  isReadonlyTupleOf,
  isReadonlyUniformTupleOf,
  isRecord,
  isRecordOf,
  isString,
  isSymbol,
  isSyncFunction,
  isTupleOf,
  isUndefined,
  isUniformTupleOf,
  isUnknown,
  ObjectOf,
  Predicate,
  PredicateType,
  ReadonlyTupleOf,
  ReadonlyUniformTupleOf,
  TupleOf,
  UniformTupleOf,
} from "./is.ts";

// It seems 'IsExact' in deno_std is false positive so use `Equal` in type-challenges
// https://github.com/type-challenges/type-challenges/blob/e77262dba62e9254451f661cb4fe5517ffd1d933/utils/index.d.ts#L7-L9
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false;

const examples = {
  string: ["", "Hello world"],
  number: [0, 1234567890],
  bigint: [0n, 1234567890n],
  boolean: [true, false],
  array: [[], [0, 1, 2], ["a", "b", "c"], [0, "a", true]],
  record: [{}, { a: 0, b: 1, c: 2 }, { a: "a", b: "b", c: "c" }],
  syncFunction: [function a() {}, () => {}],
  asyncFunction: [async function b() {}, async () => {}],
  null: [null],
  undefined: [undefined],
  symbol: [Symbol("a"), Symbol("b"), Symbol("c")],
  date: [new Date(1690248225000), new Date(0)],
  promise: [new Promise(() => {})],
} as const;

function stringify(x: unknown): string {
  if (x instanceof Date) return `Date(${x.valueOf()})`;
  if (x instanceof Promise) return "Promise";
  if (typeof x === "function") return x.toString();
  if (typeof x === "bigint") return `${x}n`;
  if (typeof x === "symbol") return x.toString();
  return JSON.stringify(x);
}

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

Deno.test("PredicateType", () => {
  const isArticle = is.ObjectOf({
    title: is.String,
    body: is.String,
    refs: is.ArrayOf(is.OneOf([
      is.String,
      is.ObjectOf({
        name: is.String,
        url: is.String,
      }),
    ])),
  });
  assertType<
    Equal<PredicateType<typeof isArticle>, {
      title: string;
      body: string;
      refs: (string | { name: string; url: string })[];
    }>
  >(true);
});

Deno.test("isAny", async (t) => {
  await testWithExamples(t, isAny, {
    validExamples: [
      "string",
      "number",
      "bigint",
      "boolean",
      "array",
      "record",
      "syncFunction",
      "asyncFunction",
      "null",
      "undefined",
      "symbol",
      "date",
      "promise",
    ],
  });
});

Deno.test("isUnknown", async (t) => {
  await testWithExamples(t, isUnknown, {
    validExamples: [
      "string",
      "number",
      "bigint",
      "boolean",
      "array",
      "record",
      "syncFunction",
      "asyncFunction",
      "null",
      "undefined",
      "symbol",
      "date",
      "promise",
    ],
  });
});

Deno.test("isString", async (t) => {
  await testWithExamples(t, isString, { validExamples: ["string"] });
});

Deno.test("isNumber", async (t) => {
  await testWithExamples(t, isNumber, { validExamples: ["number"] });
});

Deno.test("isBigInt", async (t) => {
  await testWithExamples(t, isBigInt, { validExamples: ["bigint"] });
});

Deno.test("isBoolean", async (t) => {
  await testWithExamples(t, isBoolean, { validExamples: ["boolean"] });
});

Deno.test("isArray", async (t) => {
  await testWithExamples(t, isArray, { validExamples: ["array"] });
});

Deno.test("isArrayOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isArrayOf(isNumber).name);
    await assertSnapshot(t, isArrayOf((_x): _x is string => false).name);
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = [0, 1, 2];
    if (isArrayOf(isNumber)(a)) {
      assertType<Equal<typeof a, number[]>>(true);
    }
  });
  await t.step("returns true on T array", () => {
    assertEquals(isArrayOf(isNumber)([0, 1, 2]), true);
    assertEquals(isArrayOf(isString)(["a", "b", "c"]), true);
    assertEquals(isArrayOf(isBoolean)([true, false, true]), true);
  });
  await t.step("returns false on non T array", () => {
    assertEquals(isArrayOf(isString)([0, 1, 2]), false);
    assertEquals(isArrayOf(isNumber)(["a", "b", "c"]), false);
    assertEquals(isArrayOf(isString)([true, false, true]), false);
  });
  await testWithExamples(t, isArrayOf((_: unknown): _ is unknown => true), {
    excludeExamples: ["array"],
  });
});

Deno.test("TupleOf<T>", () => {
  assertType<
    Equal<
      TupleOf<readonly [typeof is.String, typeof is.Number]>,
      [string, number]
    >
  >(true);
});

Deno.test("ReadonlyTupleOf<T>", () => {
  assertType<
    Equal<
      ReadonlyTupleOf<readonly [typeof is.String, typeof is.Number]>,
      readonly [string, number]
    >
  >(true);
});

Deno.test("isTupleOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(
      t,
      isTupleOf([isNumber, isString, isBoolean] as const).name,
    );
    await assertSnapshot(
      t,
      isTupleOf([(_x): _x is string => false] as const).name,
    );
    // Nested
    await assertSnapshot(
      t,
      isTupleOf(
        [isTupleOf(
          [isTupleOf([isNumber, isString, isBoolean] as const)] as const,
        )] as const,
      ).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const predTup = [isNumber, isString, isBoolean] as const;
    const a: unknown = [0, "a", true];
    if (isTupleOf(predTup)(a)) {
      assertType<Equal<typeof a, [number, string, boolean]>>(true);
    }
  });
  await t.step("returns true on T tuple", () => {
    const predTup = [isNumber, isString, isBoolean] as const;
    assertEquals(isTupleOf(predTup)([0, "a", true]), true);
    assertEquals(isTupleOf([])([]), true, "Specify empty predicates");
  });
  await t.step("returns false on non T tuple", () => {
    const predTup = [isNumber, isString, isBoolean] as const;
    assertEquals(isTupleOf(predTup)([0, 1, 2]), false);
    assertEquals(isTupleOf(predTup)([0, "a"]), false);
    assertEquals(isTupleOf(predTup)([0, "a", true, 0]), false);
    assertEquals(
      isTupleOf([])([0]),
      false,
      "Specify empty predicates and value has entry",
    );
  });
  await testWithExamples(t, isTupleOf([(_: unknown): _ is unknown => true]), {
    excludeExamples: ["array"],
  });
});

Deno.test("isTupleOf<T, E>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(
      t,
      isTupleOf([isNumber, isString, isBoolean] as const, is.Array).name,
    );
    await assertSnapshot(
      t,
      isTupleOf([(_x): _x is string => false] as const, is.ArrayOf(is.String))
        .name,
    );
    // Nested
    await assertSnapshot(
      t,
      isTupleOf(
        [
          isTupleOf(
            [isTupleOf(
              [isNumber, isString, isBoolean] as const,
              is.Array,
            )] as const,
            is.Array,
          ),
        ] as const,
      ).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const predTup = [isNumber, isString, isBoolean] as const;
    const predElse = is.ArrayOf(is.Number);
    const a: unknown = [0, "a", true, 0, 1, 2];
    if (isTupleOf(predTup, predElse)(a)) {
      assertType<Equal<typeof a, [number, string, boolean, ...number[]]>>(
        true,
      );
    }
  });
  await t.step("returns true on T tuple", () => {
    const predTup = [isNumber, isString, isBoolean] as const;
    const predElse = is.ArrayOf(is.Number);
    assertEquals(isTupleOf(predTup, predElse)([0, "a", true, 0, 1, 2]), true);
    assertEquals(isTupleOf([], predElse)([]), true, "Specify empty predicates");
    assertEquals(
      isTupleOf([], predElse)([0, 1, 2]),
      true,
      "Specify empty predicates",
    );
  });
  await t.step("returns false on non T tuple", () => {
    const predTup = [isNumber, isString, isBoolean] as const;
    const predElse = is.ArrayOf(is.String);
    assertEquals(isTupleOf(predTup, predElse)([0, 1, 2, 0, 1, 2]), false);
    assertEquals(isTupleOf(predTup, predElse)([0, "a", 0, 1, 2]), false);
    assertEquals(
      isTupleOf(predTup, predElse)([0, "a", true, 0, 0, 1, 2]),
      false,
    );
    assertEquals(
      isTupleOf([], predElse)([0]),
      false,
      "Specify empty predicates and value has entry",
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

Deno.test("isReadonlyTupleOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(
      t,
      isReadonlyTupleOf([isNumber, isString, isBoolean] as const).name,
    );
    await assertSnapshot(
      t,
      isReadonlyTupleOf([(_x): _x is string => false] as const).name,
    );
    // Nested
    await assertSnapshot(
      t,
      isReadonlyTupleOf(
        [
          isReadonlyTupleOf(
            [isReadonlyTupleOf(
              [isNumber, isString, isBoolean] as const,
            )] as const,
          ),
        ] as const,
      ).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const predTup = [isNumber, isString, isBoolean] as const;
    const a: unknown = [0, "a", true];
    if (isReadonlyTupleOf(predTup)(a)) {
      assertType<Equal<typeof a, readonly [number, string, boolean]>>(true);
    }
  });
  await t.step("returns true on T tuple", () => {
    const predTup = [isNumber, isString, isBoolean] as const;
    assertEquals(isReadonlyTupleOf(predTup)([0, "a", true]), true);
    assertEquals(isReadonlyTupleOf([])([]), true, "Specify empty predicates");
  });
  await t.step("returns false on non T tuple", () => {
    const predTup = [isNumber, isString, isBoolean] as const;
    assertEquals(isReadonlyTupleOf(predTup)([0, 1, 2]), false);
    assertEquals(isReadonlyTupleOf(predTup)([0, "a"]), false);
    assertEquals(isReadonlyTupleOf(predTup)([0, "a", true, 0]), false);
    assertEquals(
      isReadonlyTupleOf([])([0]),
      false,
      "Specify empty predicates and value has entry",
    );
  });
  await testWithExamples(
    t,
    isReadonlyTupleOf([(_: unknown): _ is unknown => true]),
    {
      excludeExamples: ["array"],
    },
  );
});

Deno.test("isReadonlyTupleOf<T, E>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(
      t,
      isReadonlyTupleOf([isNumber, isString, isBoolean] as const, is.Array)
        .name,
    );
    await assertSnapshot(
      t,
      isReadonlyTupleOf(
        [(_x): _x is string => false] as const,
        is.ArrayOf(is.String),
      ).name,
    );
    // Nested
    await assertSnapshot(
      t,
      isReadonlyTupleOf(
        [
          isReadonlyTupleOf(
            [
              isReadonlyTupleOf(
                [isNumber, isString, isBoolean] as const,
                is.Array,
              ),
            ] as const,
            is.Array,
          ),
        ] as const,
        is.Array,
      ).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const predTup = [isNumber, isString, isBoolean] as const;
    const predElse = is.ArrayOf(is.Number);
    const a: unknown = [0, "a", true, 0, 1, 2];
    if (isReadonlyTupleOf(predTup, predElse)(a)) {
      assertType<
        Equal<typeof a, readonly [number, string, boolean, ...number[]]>
      >(true);
    }
  });
  await t.step("returns true on T tuple", () => {
    const predTup = [isNumber, isString, isBoolean] as const;
    const predElse = is.ArrayOf(is.Number);
    assertEquals(
      isReadonlyTupleOf(predTup, predElse)([0, "a", true, 0, 1, 2]),
      true,
    );
    assertEquals(
      isReadonlyTupleOf([], predElse)([0, 1, 2]),
      true,
      "Specify empty predicates",
    );
  });
  await t.step("returns false on non T tuple", () => {
    const predTup = [isNumber, isString, isBoolean] as const;
    const predElse = is.ArrayOf(is.String);
    assertEquals(
      isReadonlyTupleOf(predTup, predElse)([0, 1, 2, 0, 1, 2]),
      false,
    );
    assertEquals(
      isReadonlyTupleOf(predTup, predElse)([0, "a", 0, 1, 2]),
      false,
    );
    assertEquals(
      isReadonlyTupleOf(predTup, predElse)([0, "a", true, 0, 0, 1, 2]),
      false,
    );
    assertEquals(
      isReadonlyTupleOf([], predElse)([0]),
      false,
      "Specify empty predicates and value has entry",
    );
    assertEquals(
      isReadonlyTupleOf(predTup, predElse)([0, "a", true, 0, 1, 2]),
      false,
    );
  });
  const predElse = is.Array;
  await testWithExamples(
    t,
    isReadonlyTupleOf([(_: unknown): _ is unknown => true], predElse),
    {
      excludeExamples: ["array"],
    },
  );
});

Deno.test("UniformTupleOf<N, T>", () => {
  assertType<
    Equal<UniformTupleOf<number, 5>, [number, number, number, number, number]>
  >(true);
});

Deno.test("ReadonlyUniformTupleOf<N, T>", () => {
  assertType<
    Equal<
      ReadonlyUniformTupleOf<number, 5>,
      readonly [
        number,
        number,
        number,
        number,
        number,
      ]
    >
  >(true);
});

Deno.test("isUniformTupleOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isUniformTupleOf(3).name);
    await assertSnapshot(t, isUniformTupleOf(3, isNumber).name);
    await assertSnapshot(
      t,
      isUniformTupleOf(3, (_x): _x is string => false).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = [0, 1, 2, 3, 4];
    if (isUniformTupleOf(5)(a)) {
      assertType<
        Equal<typeof a, [unknown, unknown, unknown, unknown, unknown]>
      >(true);
    }

    if (isUniformTupleOf(5, isNumber)(a)) {
      assertType<Equal<typeof a, [number, number, number, number, number]>>(
        true,
      );
    }
  });
  await t.step("returns true on mono-typed T tuple", () => {
    assertEquals(isUniformTupleOf(3)([0, 1, 2]), true);
    assertEquals(isUniformTupleOf(3, is.Number)([0, 1, 2]), true);
  });
  await t.step("returns false on non mono-typed T tuple", () => {
    assertEquals(isUniformTupleOf(4)([0, 1, 2]), false);
    assertEquals(isUniformTupleOf(4)([0, 1, 2, 3, 4]), false);
    assertEquals(isUniformTupleOf(3, is.Number)(["a", "b", "c"]), false);
  });
  await testWithExamples(t, isUniformTupleOf(4), {
    excludeExamples: ["array"],
  });
});

Deno.test("isReadonlyUniformTupleOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isReadonlyUniformTupleOf(3).name);
    await assertSnapshot(t, isReadonlyUniformTupleOf(3, isNumber).name);
    await assertSnapshot(
      t,
      isReadonlyUniformTupleOf(3, (_x): _x is string => false).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = [0, 1, 2, 3, 4];
    if (isReadonlyUniformTupleOf(5)(a)) {
      assertType<
        Equal<
          typeof a,
          readonly [unknown, unknown, unknown, unknown, unknown]
        >
      >(true);
    }

    if (isReadonlyUniformTupleOf(5, isNumber)(a)) {
      assertType<
        Equal<typeof a, readonly [number, number, number, number, number]>
      >(true);
    }
  });
  await t.step("returns true on mono-typed T tuple", () => {
    assertEquals(isReadonlyUniformTupleOf(3)([0, 1, 2]), true);
    assertEquals(isReadonlyUniformTupleOf(3, is.Number)([0, 1, 2]), true);
  });
  await t.step("returns false on non mono-typed T tuple", () => {
    assertEquals(isReadonlyUniformTupleOf(4)([0, 1, 2]), false);
    assertEquals(isReadonlyUniformTupleOf(4)([0, 1, 2, 3, 4]), false);
    assertEquals(
      isReadonlyUniformTupleOf(3, is.Number)(["a", "b", "c"]),
      false,
    );
  });
  await testWithExamples(t, isReadonlyUniformTupleOf(4), {
    excludeExamples: ["array"],
  });
});

Deno.test("isRecord", async (t) => {
  await testWithExamples(t, isRecord, {
    validExamples: ["record", "date", "promise"],
  });
});

Deno.test("isRecordOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isRecordOf(isNumber).name);
    await assertSnapshot(t, isRecordOf((_x): _x is string => false).name);
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = { a: 0 };
    if (isRecordOf(isNumber)(a)) {
      assertType<Equal<typeof a, Record<PropertyKey, number>>>(true);
    }
  });
  await t.step("returns true on T record", () => {
    assertEquals(isRecordOf(isNumber)({ a: 0 }), true);
    assertEquals(isRecordOf(isString)({ a: "a" }), true);
    assertEquals(isRecordOf(isBoolean)({ a: true }), true);
  });
  await t.step("returns false on non T record", () => {
    assertEquals(isRecordOf(isString)({ a: 0 }), false);
    assertEquals(isRecordOf(isNumber)({ a: "a" }), false);
    assertEquals(isRecordOf(isString)({ a: true }), false);
  });
  await testWithExamples(t, isRecordOf((_: unknown): _ is unknown => true), {
    excludeExamples: ["record", "date", "promise"],
  });
});

Deno.test("isRecordOf<T, K>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isRecordOf(isNumber, isString).name);
    await assertSnapshot(
      t,
      isRecordOf((_x): _x is string => false, isString).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = { a: 0 };
    if (isRecordOf(isNumber, isString)(a)) {
      assertType<Equal<typeof a, Record<string, number>>>(true);
    }
  });
  await t.step("returns true on T record", () => {
    assertEquals(isRecordOf(isNumber, isString)({ a: 0 }), true);
    assertEquals(isRecordOf(isString, isString)({ a: "a" }), true);
    assertEquals(isRecordOf(isBoolean, isString)({ a: true }), true);
  });
  await t.step("returns false on non T record", () => {
    assertEquals(isRecordOf(isString, isString)({ a: 0 }), false);
    assertEquals(isRecordOf(isNumber, isString)({ a: "a" }), false);
    assertEquals(isRecordOf(isString, isString)({ a: true }), false);
  });
  await t.step("returns false on non K record", () => {
    assertEquals(isRecordOf(isNumber, isNumber)({ a: 0 }), false);
    assertEquals(isRecordOf(isString, isNumber)({ a: "a" }), false);
    assertEquals(isRecordOf(isBoolean, isNumber)({ a: true }), false);
  });
  await testWithExamples(t, isRecordOf((_: unknown): _ is unknown => true), {
    excludeExamples: ["record", "date", "promise"],
  });
});

Deno.test("ObjectOf<T>", () => {
  assertType<
    Equal<
      ObjectOf<{ a: typeof is.Number; b: typeof is.String }>,
      { a: number; b: string }
    >
  >(true);
});

Deno.test("isObjectOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(
      t,
      isObjectOf({ a: isNumber, b: isString, c: isBoolean }).name,
    );
    await assertSnapshot(
      t,
      isObjectOf({ a: (_x): _x is string => false }).name,
    );
    // Nested
    await assertSnapshot(
      t,
      isObjectOf({ a: isObjectOf({ b: isObjectOf({ c: isBoolean }) }) }).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const predObj = {
      a: isNumber,
      b: isString,
      c: isBoolean,
    };
    const a: unknown = { a: 0, b: "a", c: true };
    if (isObjectOf(predObj)(a)) {
      assertType<Equal<typeof a, { a: number; b: string; c: boolean }>>(true);
    }
  });
  await t.step("returns true on T object", () => {
    const predObj = {
      a: isNumber,
      b: isString,
      c: isBoolean,
    };
    assertEquals(isObjectOf(predObj)({ a: 0, b: "a", c: true }), true);
    assertEquals(
      isObjectOf(predObj, { strict: true })({ a: 0, b: "a", c: true }),
      true,
      "Specify `{ strict: true }`",
    );
    assertEquals(
      isObjectOf(predObj)({ a: 0, b: "a", c: true, d: "ignored" }),
      true,
      "Object have an unknown property",
    );
  });
  await t.step("returns false on non T object", () => {
    const predObj = {
      a: isNumber,
      b: isString,
      c: isBoolean,
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
      isObjectOf(predObj, { strict: true })({
        a: 0,
        b: "a",
        c: true,
        d: "invalid",
      }),
      false,
      "Specify `{ strict: true }` and object have an unknown property",
    );
  });
  await testWithExamples(
    t,
    isObjectOf({ a: (_: unknown): _ is unknown => false }),
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
      if (isObjectOf(predObj)(a)) {
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
      assertEquals(isObjectOf(predObj)({ a: 0, b: "a", c: true }), true);
      assertEquals(
        isObjectOf(predObj)({ a: 0, b: "a" }),
        true,
        "Object does not have an optional property",
      );
      assertEquals(
        isObjectOf(predObj)({ a: 0, b: "a", c: undefined }),
        true,
        "Object has `undefined` as value of optional property",
      );
      assertEquals(
        isObjectOf(predObj, { strict: true })({ a: 0, b: "a", c: true }),
        true,
        "Specify `{ strict: true }`",
      );
      assertEquals(
        isObjectOf(predObj, { strict: true })({ a: 0, b: "a" }),
        true,
        "Specify `{ strict: true }` and object does not have one optional property",
      );
    });
    await t.step("returns false on non T object", () => {
      const predObj = {
        a: isNumber,
        b: isOneOf([isString, isUndefined]),
        c: isOptionalOf(isBoolean),
      };
      assertEquals(
        isObjectOf(predObj)({ a: 0, b: "a", c: "" }),
        false,
        "Object have a different type property",
      );
      assertEquals(
        isObjectOf(predObj)({ a: 0, b: "a", c: null }),
        false,
        "Object has `null` as value of optional property",
      );
      assertEquals(
        isObjectOf(predObj, { strict: true })({
          a: 0,
          b: "a",
          c: true,
          d: "invalid",
        }),
        false,
        "Specify `{ strict: true }` and object have an unknown property",
      );
      assertEquals(
        isObjectOf(predObj, { strict: true })({
          a: 0,
          b: "a",
          d: "invalid",
        }),
        false,
        "Specify `{ strict: true }` and object have the same number of properties but an unknown property exists",
      );
    });
  });
});

Deno.test("isFunction", async (t) => {
  await testWithExamples(t, isFunction, {
    validExamples: ["syncFunction", "asyncFunction"],
  });
  assertType<
    Equal<PredicateType<typeof isFunction>, (...args: unknown[]) => unknown>
  >(true);
});

Deno.test("isSyncFunction", async (t) => {
  await testWithExamples(t, isSyncFunction, {
    validExamples: ["syncFunction"],
  });
  assertType<
    Equal<
      PredicateType<typeof isSyncFunction>,
      (...args: unknown[]) => unknown
    >
  >(true);
});

Deno.test("isAsyncFunction", async (t) => {
  await testWithExamples(t, isAsyncFunction, {
    validExamples: ["asyncFunction"],
  });
  assertType<
    Equal<
      PredicateType<typeof isAsyncFunction>,
      (...args: unknown[]) => Promise<unknown>
    >
  >(true);
});

Deno.test("isInstanceOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isInstanceOf(Date).name);
    await assertSnapshot(t, isInstanceOf(class {}).name);
  });
  await t.step("returns true on T instance", () => {
    class Cls {}
    assertEquals(isInstanceOf(Cls)(new Cls()), true);
    assertEquals(isInstanceOf(Date)(new Date()), true);
    assertEquals(isInstanceOf(Promise<string>)(new Promise(() => {})), true);
  });
  await t.step("with user-defined class", async (t) => {
    class Cls {}
    await testWithExamples(t, isInstanceOf(Cls));
  });
  await t.step("with Date", async (t) => {
    await testWithExamples(t, isInstanceOf(Date), { validExamples: ["date"] });
  });
  await t.step("with Promise", async (t) => {
    await testWithExamples(t, isInstanceOf(Promise), {
      validExamples: ["promise"],
    });
  });
  await t.step("returns proper type predicate", () => {
    class Cls {}
    const a: unknown = new Cls();
    if (isInstanceOf(Cls)(a)) {
      assertType<Equal<typeof a, Cls>>(true);
    }

    const b: unknown = new Date();
    if (isInstanceOf(Date)(b)) {
      assertType<Equal<typeof b, Date>>(true);
    }

    const c: unknown = new Promise(() => {});
    if (isInstanceOf(Promise)(c)) {
      assertType<Equal<typeof c, Promise<unknown>>>(true);
    }
  });
});

Deno.test("isNull", async (t) => {
  await testWithExamples(t, isNull, { validExamples: ["null"] });
});

Deno.test("isUndefined", async (t) => {
  await testWithExamples(t, isUndefined, { validExamples: ["undefined"] });
});

Deno.test("isNullish", async (t) => {
  await testWithExamples(t, isNullish, {
    validExamples: ["null", "undefined"],
  });
});

Deno.test("isSymbol", async (t) => {
  await testWithExamples(t, isSymbol, { validExamples: ["symbol"] });
});

Deno.test("isPrimitive", async (t) => {
  await testWithExamples(t, isPrimitive, {
    validExamples: [
      "string",
      "number",
      "bigint",
      "boolean",
      "null",
      "undefined",
      "symbol",
    ],
  });
});

Deno.test("isLiteralOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isLiteralOf("hello").name);
    await assertSnapshot(t, isLiteralOf(100).name);
    await assertSnapshot(t, isLiteralOf(100n).name);
    await assertSnapshot(t, isLiteralOf(true).name);
    await assertSnapshot(t, isLiteralOf(null).name);
    await assertSnapshot(t, isLiteralOf(undefined).name);
    await assertSnapshot(t, isLiteralOf(Symbol("asdf")).name);
  });
  await t.step("returns proper type predicate", () => {
    const pred = "hello";
    const a: unknown = "hello";
    if (isLiteralOf(pred)(a)) {
      assertType<Equal<typeof a, "hello">>(true);
    }
  });
  await t.step("returns true on literal T", () => {
    const pred = "hello";
    assertEquals(isLiteralOf(pred)("hello"), true);
  });
  await t.step("returns false on non literal T", async (t) => {
    const pred = "hello";
    await testWithExamples(t, isLiteralOf(pred));
  });
});

Deno.test("isLiteralOneOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isLiteralOneOf(["hello", "world"]).name);
  });
  await t.step("returns proper type predicate", () => {
    const preds = ["hello", "world"] as const;
    const a: unknown = "hello";
    if (isLiteralOneOf(preds)(a)) {
      assertType<Equal<typeof a, "hello" | "world">>(true);
    }
  });
  await t.step("returns true on literal T", () => {
    const preds = ["hello", "world"] as const;
    assertEquals(isLiteralOneOf(preds)("hello"), true);
    assertEquals(isLiteralOneOf(preds)("world"), true);
  });
  await t.step("returns false on non literal T", async (t) => {
    const preds = ["hello", "world"] as const;
    await testWithExamples(t, isLiteralOneOf(preds));
  });
});

Deno.test("isOneOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isOneOf([isNumber, isString, isBoolean]).name);
  });
  await t.step("returns proper type predicate", () => {
    const preds = [isNumber, isString, isBoolean];
    const a: unknown = [0, "a", true];
    if (isOneOf(preds)(a)) {
      assertType<Equal<typeof a, number | string | boolean>>(true);
    }
  });
  await t.step("returns true on one of T", () => {
    const preds = [isNumber, isString, isBoolean];
    assertEquals(isOneOf(preds)(0), true);
    assertEquals(isOneOf(preds)("a"), true);
    assertEquals(isOneOf(preds)(true), true);
  });
  await t.step("returns false on non of T", async (t) => {
    const preds = [isNumber, isString, isBoolean];
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
        is.ObjectOf({ a: is.Number }),
        is.ObjectOf({ b: is.String }),
      ]).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const preds = [
      is.ObjectOf({ a: is.Number }),
      is.ObjectOf({ b: is.String }),
    ];
    const a: unknown = { a: 0, b: "a" };
    if (isAllOf(preds)(a)) {
      assertType<Equal<typeof a, { a: number } & { b: string }>>(true);
    }
  });
  await t.step("returns true on all of T", () => {
    const preds = [
      is.ObjectOf({ a: is.Number }),
      is.ObjectOf({ b: is.String }),
    ];
    assertEquals(isAllOf(preds)({ a: 0, b: "a" }), true);
  });
  await t.step("returns false on non of T", async (t) => {
    const preds = [
      is.ObjectOf({ a: is.Number }),
      is.ObjectOf({ b: is.String }),
    ];
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
  await t.step("with isRecord", async (t) => {
    await testWithExamples(t, isOptionalOf(isRecord), {
      validExamples: ["record", "date", "promise", "undefined"],
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

Deno.test("is", async (t) => {
  const mod = await import("./is.ts");
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
