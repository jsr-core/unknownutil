import { assertEquals, assertStrictEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { assertType } from "@std/testing/types";
import { type Equal, stringify } from "./_testutil.ts";
import type { Predicate, PredicateType } from "./type.ts";
import {
  is,
  isAllOf,
  isAny,
  isArray,
  isArrayOf,
  isAsyncFunction,
  isBigInt,
  isBoolean,
  isFunction,
  isInstanceOf,
  isIntersectionOf,
  isLiteralOf,
  isLiteralOneOf,
  isMap,
  isMapOf,
  isNull,
  isNullish,
  isNumber,
  isObjectOf,
  isOmitOf,
  isOneOf,
  isOptionalOf,
  isParametersOf,
  isPartialOf,
  isPickOf,
  isPrimitive,
  isReadonlyOf,
  isReadonlyTupleOf,
  isReadonlyUniformTupleOf,
  isRecord,
  isRecordLike,
  isRecordLikeOf,
  isRecordObject,
  isRecordObjectOf,
  isRecordOf,
  isRequiredOf,
  isSet,
  isSetOf,
  isStrictOf,
  isString,
  isSymbol,
  isSyncFunction,
  isTupleOf,
  isUndefined,
  isUniformTupleOf,
  isUnionOf,
  isUnknown,
  isUnwrapOptionalOf,
  isUnwrapReadonlyOf,
} from "./is.ts";

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

Deno.test("isAny", async (t) => {
  await testWithExamples(t, isAny, {
    validExamples: [
      "string",
      "number",
      "bigint",
      "boolean",
      "array",
      "set",
      "record",
      "map",
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
      "set",
      "record",
      "map",
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

Deno.test("isSet", async (t) => {
  await testWithExamples(t, isSet, { validExamples: ["set"] });
});

Deno.test("isRecordObject", async (t) => {
  await testWithExamples(t, isRecordObject, {
    validExamples: ["record"],
  });
});

Deno.test("isRecord", async (t) => {
  await testWithExamples(t, isRecord, {
    validExamples: ["record", "date", "promise", "set", "map"],
  });
});

Deno.test("isRecordLike", async (t) => {
  await testWithExamples(t, isRecordLike, {
    validExamples: ["record", "date", "promise", "set", "map"],
  });
});

Deno.test("isMap", async (t) => {
  await testWithExamples(t, isMap, {
    validExamples: ["map"],
  });
});

Deno.test("isFunction", async (t) => {
  await testWithExamples(t, isFunction, {
    validExamples: ["syncFunction", "asyncFunction"],
  });
});

Deno.test("isSyncFunction", async (t) => {
  await testWithExamples(t, isSyncFunction, {
    validExamples: ["syncFunction"],
  });
});

Deno.test("isAsyncFunction", async (t) => {
  await testWithExamples(t, isAsyncFunction, {
    validExamples: ["asyncFunction"],
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
  await t.step("with isRecordObject", async (t) => {
    await testWithExamples(t, isOptionalOf(isRecordObject), {
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

Deno.test("isUnwrapOptionalOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isUnwrapOptionalOf(isOptionalOf(isNumber)).name);
    // Non optional does nothing
    await assertSnapshot(t, isUnwrapOptionalOf(isNumber).name);
    // Nesting does nothing
    await assertSnapshot(
      t,
      isUnwrapOptionalOf(isUnwrapOptionalOf(isOptionalOf(isNumber))).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = undefined;
    if (isUnwrapOptionalOf(isOptionalOf(isNumber))(a)) {
      assertType<Equal<typeof a, number>>(true);
    }
    if (isUnwrapOptionalOf(isNumber)(a)) {
      assertType<Equal<typeof a, number>>(true);
    }
  });
  await t.step("with isString", async (t) => {
    await testWithExamples(t, isUnwrapOptionalOf(isOptionalOf(isString)), {
      validExamples: ["string"],
    });
  });
  await t.step("with isNumber", async (t) => {
    await testWithExamples(t, isUnwrapOptionalOf(isOptionalOf(isNumber)), {
      validExamples: ["number"],
    });
  });
  await t.step("with isBigInt", async (t) => {
    await testWithExamples(t, isUnwrapOptionalOf(isOptionalOf(isBigInt)), {
      validExamples: ["bigint"],
    });
  });
  await t.step("with isBoolean", async (t) => {
    await testWithExamples(t, isUnwrapOptionalOf(isOptionalOf(isBoolean)), {
      validExamples: ["boolean"],
    });
  });
  await t.step("with isArray", async (t) => {
    await testWithExamples(t, isUnwrapOptionalOf(isOptionalOf(isArray)), {
      validExamples: ["array"],
    });
  });
  await t.step("with isSet", async (t) => {
    await testWithExamples(t, isUnwrapOptionalOf(isOptionalOf(isSet)), {
      validExamples: ["set"],
    });
  });
  await t.step("with isRecordObject", async (t) => {
    await testWithExamples(
      t,
      isUnwrapOptionalOf(isOptionalOf(isRecordObject)),
      {
        validExamples: ["record"],
      },
    );
  });
  await t.step("with isFunction", async (t) => {
    await testWithExamples(t, isUnwrapOptionalOf(isOptionalOf(isFunction)), {
      validExamples: ["syncFunction", "asyncFunction"],
    });
  });
  await t.step("with isSyncFunction", async (t) => {
    await testWithExamples(
      t,
      isUnwrapOptionalOf(isOptionalOf(isSyncFunction)),
      {
        validExamples: ["syncFunction"],
      },
    );
  });
  await t.step("with isAsyncFunction", async (t) => {
    await testWithExamples(
      t,
      isUnwrapOptionalOf(isOptionalOf(isAsyncFunction)),
      {
        validExamples: ["asyncFunction"],
      },
    );
  });
  await t.step("with isNull", async (t) => {
    await testWithExamples(t, isUnwrapOptionalOf(isOptionalOf(isNull)), {
      validExamples: ["null"],
    });
  });
  await t.step("with isUndefined", async (t) => {
    await testWithExamples(t, isUnwrapOptionalOf(isOptionalOf(isUndefined)), {
      validExamples: ["undefined"],
    });
  });
  await t.step("with isSymbol", async (t) => {
    await testWithExamples(t, isUnwrapOptionalOf(isOptionalOf(isSymbol)), {
      validExamples: ["symbol"],
    });
  });
});

Deno.test("isReadonlyOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isReadonlyOf(isNumber).name);
    // Nesting does nothing
    await assertSnapshot(t, isReadonlyOf(isReadonlyOf(isNumber)).name);
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = undefined;
    if (isReadonlyOf(isNumber)(a)) {
      assertType<Equal<typeof a, Readonly<number>>>(true);
    }
    if (isReadonlyOf(isTupleOf([isString, isNumber, isBoolean]))(a)) {
      assertType<Equal<typeof a, Readonly<[string, number, boolean]>>>(true);
    }
    if (isReadonlyOf(isUniformTupleOf(3, isString))(a)) {
      assertType<Equal<typeof a, Readonly<[string, string, string]>>>(true);
    }
    if (
      isReadonlyOf(isObjectOf({ a: isString, b: isNumber, c: isBoolean }))(a)
    ) {
      assertType<
        Equal<typeof a, Readonly<{ a: string; b: number; c: boolean }>>
      >(true);
    }
  });
});

Deno.test("isUnwrapReadonlyOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isUnwrapReadonlyOf(isReadonlyOf(isNumber)).name);
    // Nesting does nothing
    await assertSnapshot(
      t,
      isUnwrapReadonlyOf(isReadonlyOf(isReadonlyOf(isNumber))).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = undefined;
    if (isUnwrapReadonlyOf(isReadonlyOf(isNumber))(a)) {
      assertType<Equal<typeof a, number>>(true);
    }
    if (
      isUnwrapReadonlyOf(
        isReadonlyOf(isTupleOf([isString, isNumber, isBoolean])),
      )(a)
    ) {
      assertType<Equal<typeof a, [string, number, boolean]>>(true);
    }
    if (isUnwrapReadonlyOf(isReadonlyOf(isUniformTupleOf(3, isString)))(a)) {
      assertType<Equal<typeof a, [string, string, string]>>(true);
    }
    if (
      isUnwrapReadonlyOf(
        isReadonlyOf(isObjectOf({ a: isString, b: isNumber, c: isBoolean })),
      )(a)
    ) {
      assertType<
        Equal<typeof a, { a: string; b: number; c: boolean }>
      >(true);
    }
  });
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

Deno.test("isSetOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isSetOf(isNumber).name);
    await assertSnapshot(t, isSetOf((_x): _x is string => false).name);
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = new Set([0, 1, 2]);
    if (isSetOf(isNumber)(a)) {
      assertType<Equal<typeof a, Set<number>>>(true);
    }
  });
  await t.step("returns true on T set", () => {
    assertEquals(isSetOf(isNumber)(new Set([0, 1, 2])), true);
    assertEquals(isSetOf(isString)(new Set(["a", "b", "c"])), true);
    assertEquals(isSetOf(isBoolean)(new Set([true, false, true])), true);
  });
  await t.step("returns false on non T set", () => {
    assertEquals(isSetOf(isString)(new Set([0, 1, 2])), false);
    assertEquals(isSetOf(isNumber)(new Set(["a", "b", "c"])), false);
    assertEquals(isSetOf(isString)(new Set([true, false, true])), false);
  });
  await testWithExamples(t, isSetOf((_: unknown): _ is unknown => true), {
    excludeExamples: ["set"],
  });
});

Deno.test("isTupleOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(
      t,
      isTupleOf([isNumber, isString, isBoolean]).name,
    );
    await assertSnapshot(
      t,
      isTupleOf([(_x): _x is string => false]).name,
    );
    // Nested
    await assertSnapshot(
      t,
      isTupleOf([isTupleOf([isTupleOf([isNumber, isString, isBoolean])])]).name,
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
  });
  await t.step("returns false on non T tuple", () => {
    const predTup = [isNumber, isString, isBoolean] as const;
    assertEquals(isTupleOf(predTup)([0, 1, 2]), false);
    assertEquals(isTupleOf(predTup)([0, "a"]), false);
    assertEquals(isTupleOf(predTup)([0, "a", true, 0]), false);
  });
  await testWithExamples(t, isTupleOf([(_: unknown): _ is unknown => true]), {
    excludeExamples: ["array"],
  });
});

Deno.test("isTupleOf<T, E>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(
      t,
      isTupleOf([isNumber, isString, isBoolean], isArray).name,
    );
    await assertSnapshot(
      t,
      isTupleOf([(_x): _x is string => false], isArrayOf(isString))
        .name,
    );
    // Nested
    await assertSnapshot(
      t,
      isTupleOf([
        isTupleOf(
          [isTupleOf([isNumber, isString, isBoolean], isArray)],
          isArray,
        ),
      ]).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const predTup = [isNumber, isString, isBoolean] as const;
    const predElse = isArrayOf(isNumber);
    const a: unknown = [0, "a", true, 0, 1, 2];
    if (isTupleOf(predTup, predElse)(a)) {
      assertType<Equal<typeof a, [number, string, boolean, ...number[]]>>(
        true,
      );
    }
  });
  await t.step("returns true on T tuple", () => {
    const predTup = [isNumber, isString, isBoolean] as const;
    const predElse = isArrayOf(isNumber);
    assertEquals(isTupleOf(predTup, predElse)([0, "a", true, 0, 1, 2]), true);
  });
  await t.step("returns false on non T tuple", () => {
    const predTup = [isNumber, isString, isBoolean] as const;
    const predElse = isArrayOf(isString);
    assertEquals(isTupleOf(predTup, predElse)([0, 1, 2, 0, 1, 2]), false);
    assertEquals(isTupleOf(predTup, predElse)([0, "a", 0, 1, 2]), false);
    assertEquals(
      isTupleOf(predTup, predElse)([0, "a", true, 0, 0, 1, 2]),
      false,
    );
    assertEquals(isTupleOf(predTup, predElse)([0, "a", true, 0, 1, 2]), false);
  });
  const predElse = isArray;
  await testWithExamples(
    t,
    isTupleOf([(_: unknown): _ is unknown => true], predElse),
    {
      excludeExamples: ["array"],
    },
  );
});

Deno.test("isParametersOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(
      t,
      isParametersOf([isNumber, isString, isOptionalOf(isBoolean)]).name,
    );
    await assertSnapshot(
      t,
      isParametersOf([(_x): _x is string => false]).name,
    );
    await assertSnapshot(
      t,
      isParametersOf([]).name,
    );
    // Nested
    await assertSnapshot(
      t,
      isParametersOf([
        isParametersOf([
          isParametersOf([isNumber, isString, isOptionalOf(isBoolean)]),
        ]),
      ]).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const predTup = [
      isOptionalOf(isNumber),
      isString,
      isOptionalOf(isString),
      isOptionalOf(isBoolean),
    ] as const;
    const a: unknown = [0, "a"];
    if (isParametersOf(predTup)(a)) {
      assertType<
        Equal<typeof a, [number | undefined, string, string?, boolean?]>
      >(true);
    }
  });
  await t.step("returns true on T tuple", () => {
    const predTup = [isNumber, isString, isOptionalOf(isBoolean)] as const;
    assertEquals(isParametersOf(predTup)([0, "a", true]), true);
    assertEquals(isParametersOf(predTup)([0, "a"]), true);
  });
  await t.step("returns false on non T tuple", () => {
    const predTup = [isNumber, isString, isOptionalOf(isBoolean)] as const;
    assertEquals(isParametersOf(predTup)([0, 1, 2]), false);
    assertEquals(isParametersOf(predTup)([0, "a", true, 0]), false);
  });
  await testWithExamples(
    t,
    isParametersOf([(_: unknown): _ is unknown => true]),
    {
      excludeExamples: ["array"],
    },
  );
});

Deno.test("isParametersOf<T, E>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(
      t,
      isParametersOf([isNumber, isString, isOptionalOf(isBoolean)], isArray)
        .name,
    );
    await assertSnapshot(
      t,
      isParametersOf([(_x): _x is string => false], isArrayOf(isString))
        .name,
    );
    // Empty
    await assertSnapshot(
      t,
      isParametersOf([], isArrayOf(isString)).name,
    );
    // Nested
    await assertSnapshot(
      t,
      isParametersOf([
        isParametersOf(
          [isParametersOf(
            [isNumber, isString, isOptionalOf(isBoolean)],
            isArray,
          )],
          isArray,
        ),
      ]).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const predTup = [
      isOptionalOf(isNumber),
      isString,
      isOptionalOf(isString),
      isOptionalOf(isBoolean),
    ] as const;
    const predElse = isArrayOf(isNumber);
    const a: unknown = [0, "a"];
    if (isParametersOf(predTup, predElse)(a)) {
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
  await t.step("returns true on T tuple", () => {
    const predTup = [isNumber, isString, isOptionalOf(isBoolean)] as const;
    const predElse = isArrayOf(isNumber);
    assertEquals(
      isParametersOf(predTup, predElse)([0, "a", true, 0, 1, 2]),
      true,
    );
    assertEquals(
      isParametersOf(predTup, predElse)([0, "a", undefined, 0, 1, 2]),
      true,
    );
    assertEquals(isParametersOf(predTup, predElse)([0, "a"]), true);
  });
  await t.step("returns false on non T tuple", () => {
    const predTup = [isNumber, isString, isOptionalOf(isBoolean)] as const;
    const predElse = isArrayOf(isString);
    assertEquals(isParametersOf(predTup, predElse)([0, 1, 2, 0, 1, 2]), false);
    assertEquals(isParametersOf(predTup, predElse)([0, "a", 0, 1, 2]), false);
    assertEquals(
      isParametersOf(predTup, predElse)([0, "a", true, 0, 1, 2]),
      false,
    );
    assertEquals(
      isParametersOf(predTup, predElse)([0, "a", undefined, 0, 1, 2]),
      false,
    );
    assertEquals(isParametersOf(predTup, predElse)([0, "a", "b"]), false);
  });
  const predElse = isArray;
  await testWithExamples(
    t,
    isParametersOf([(_: unknown): _ is unknown => true], predElse),
    {
      excludeExamples: ["array"],
    },
  );
});

Deno.test("isReadonlyTupleOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(
      t,
      isReadonlyTupleOf([isNumber, isString, isBoolean]).name,
    );
    await assertSnapshot(
      t,
      isReadonlyTupleOf([(_x): _x is string => false]).name,
    );
    // Nested
    await assertSnapshot(
      t,
      isReadonlyTupleOf([
        isReadonlyTupleOf([isReadonlyTupleOf([isNumber, isString, isBoolean])]),
      ]).name,
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
  });
  await t.step("returns false on non T tuple", () => {
    const predTup = [isNumber, isString, isBoolean] as const;
    assertEquals(isReadonlyTupleOf(predTup)([0, 1, 2]), false);
    assertEquals(isReadonlyTupleOf(predTup)([0, "a"]), false);
    assertEquals(isReadonlyTupleOf(predTup)([0, "a", true, 0]), false);
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
      isReadonlyTupleOf([isNumber, isString, isBoolean], isArray)
        .name,
    );
    await assertSnapshot(
      t,
      isReadonlyTupleOf(
        [(_x): _x is string => false],
        isArrayOf(isString),
      ).name,
    );
    // Nested
    await assertSnapshot(
      t,
      isReadonlyTupleOf([
        isReadonlyTupleOf([
          isReadonlyTupleOf([isNumber, isString, isBoolean], isArray),
        ], isArray),
      ], isArray).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const predTup = [isNumber, isString, isBoolean] as const;
    const predElse = isArrayOf(isNumber);
    const a: unknown = [0, "a", true, 0, 1, 2];
    if (isReadonlyTupleOf(predTup, predElse)(a)) {
      assertType<
        Equal<typeof a, readonly [number, string, boolean, ...number[]]>
      >(true);
    }
  });
  await t.step("returns true on T tuple", () => {
    const predTup = [isNumber, isString, isBoolean] as const;
    const predElse = isArrayOf(isNumber);
    assertEquals(
      isReadonlyTupleOf(predTup, predElse)([0, "a", true, 0, 1, 2]),
      true,
    );
  });
  await t.step("returns false on non T tuple", () => {
    const predTup = [isNumber, isString, isBoolean] as const;
    const predElse = isArrayOf(isString);
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
      isReadonlyTupleOf(predTup, predElse)([0, "a", true, 0, 1, 2]),
      false,
    );
  });
  const predElse = isArray;
  await testWithExamples(
    t,
    isReadonlyTupleOf([(_: unknown): _ is unknown => true], predElse),
    {
      excludeExamples: ["array"],
    },
  );
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
    assertEquals(isUniformTupleOf(3, isNumber)([0, 1, 2]), true);
  });
  await t.step("returns false on non mono-typed T tuple", () => {
    assertEquals(isUniformTupleOf(4)([0, 1, 2]), false);
    assertEquals(isUniformTupleOf(4)([0, 1, 2, 3, 4]), false);
    assertEquals(isUniformTupleOf(3, isNumber)(["a", "b", "c"]), false);
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
    assertEquals(isReadonlyUniformTupleOf(3, isNumber)([0, 1, 2]), true);
  });
  await t.step("returns false on non mono-typed T tuple", () => {
    assertEquals(isReadonlyUniformTupleOf(4)([0, 1, 2]), false);
    assertEquals(isReadonlyUniformTupleOf(4)([0, 1, 2, 3, 4]), false);
    assertEquals(
      isReadonlyUniformTupleOf(3, isNumber)(["a", "b", "c"]),
      false,
    );
  });
  await testWithExamples(t, isReadonlyUniformTupleOf(4), {
    excludeExamples: ["array"],
  });
});

Deno.test("isRecordObjectOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isRecordObjectOf(isNumber).name);
    await assertSnapshot(t, isRecordObjectOf((_x): _x is string => false).name);
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = { a: 0 };
    if (isRecordObjectOf(isNumber)(a)) {
      assertType<Equal<typeof a, Record<PropertyKey, number>>>(true);
    }
  });
  await t.step("returns true on T record", () => {
    assertEquals(isRecordObjectOf(isNumber)({ a: 0 }), true);
    assertEquals(isRecordObjectOf(isString)({ a: "a" }), true);
    assertEquals(isRecordObjectOf(isBoolean)({ a: true }), true);
  });
  await t.step("returns false on non T record", () => {
    assertEquals(isRecordObjectOf(isString)({ a: 0 }), false);
    assertEquals(isRecordObjectOf(isNumber)({ a: "a" }), false);
    assertEquals(isRecordObjectOf(isString)({ a: true }), false);
  });
  await testWithExamples(
    t,
    isRecordObjectOf((_: unknown): _ is unknown => true),
    {
      excludeExamples: ["record"],
    },
  );
});

Deno.test("isRecordObjectOf<T, K>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isRecordObjectOf(isNumber, isString).name);
    await assertSnapshot(
      t,
      isRecordObjectOf((_x): _x is string => false, isString).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = { a: 0 };
    if (isRecordObjectOf(isNumber, isString)(a)) {
      assertType<Equal<typeof a, Record<string, number>>>(true);
    }
  });
  await t.step("returns true on T record", () => {
    assertEquals(isRecordObjectOf(isNumber, isString)({ a: 0 }), true);
    assertEquals(isRecordObjectOf(isString, isString)({ a: "a" }), true);
    assertEquals(isRecordObjectOf(isBoolean, isString)({ a: true }), true);
  });
  await t.step("returns false on non T record", () => {
    assertEquals(isRecordObjectOf(isString, isString)({ a: 0 }), false);
    assertEquals(isRecordObjectOf(isNumber, isString)({ a: "a" }), false);
    assertEquals(isRecordObjectOf(isString, isString)({ a: true }), false);
  });
  await t.step("returns false on non K record", () => {
    assertEquals(isRecordObjectOf(isNumber, isNumber)({ a: 0 }), false);
    assertEquals(isRecordObjectOf(isString, isNumber)({ a: "a" }), false);
    assertEquals(isRecordObjectOf(isBoolean, isNumber)({ a: true }), false);
  });
  await testWithExamples(
    t,
    isRecordObjectOf((_: unknown): _ is unknown => true),
    {
      excludeExamples: ["record"],
    },
  );
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
  await testWithExamples(
    t,
    isRecordOf((_: unknown): _ is unknown => true),
    {
      excludeExamples: ["record", "date", "promise", "set", "map"],
    },
  );
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
  await testWithExamples(
    t,
    isRecordOf((_: unknown): _ is unknown => true),
    {
      excludeExamples: ["record", "date", "promise", "set", "map"],
    },
  );
});

Deno.test("isRecordLikeOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isRecordLikeOf(isNumber).name);
    await assertSnapshot(t, isRecordLikeOf((_x): _x is string => false).name);
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = { a: 0 };
    if (isRecordLikeOf(isNumber)(a)) {
      assertType<Equal<typeof a, Record<PropertyKey, number>>>(true);
    }
  });
  await t.step("returns true on T record", () => {
    assertEquals(isRecordLikeOf(isNumber)({ a: 0 }), true);
    assertEquals(isRecordLikeOf(isString)({ a: "a" }), true);
    assertEquals(isRecordLikeOf(isBoolean)({ a: true }), true);
  });
  await t.step("returns false on non T record", () => {
    assertEquals(isRecordLikeOf(isString)({ a: 0 }), false);
    assertEquals(isRecordLikeOf(isNumber)({ a: "a" }), false);
    assertEquals(isRecordLikeOf(isString)({ a: true }), false);
  });
  await testWithExamples(
    t,
    isRecordLikeOf((_: unknown): _ is unknown => true),
    {
      excludeExamples: ["record", "date", "promise", "set", "map"],
    },
  );
});

Deno.test("isRecordLikeOf<T, K>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isRecordLikeOf(isNumber, isString).name);
    await assertSnapshot(
      t,
      isRecordLikeOf((_x): _x is string => false, isString).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = { a: 0 };
    if (isRecordLikeOf(isNumber, isString)(a)) {
      assertType<Equal<typeof a, Record<string, number>>>(true);
    }
  });
  await t.step("returns true on T record", () => {
    assertEquals(isRecordLikeOf(isNumber, isString)({ a: 0 }), true);
    assertEquals(isRecordLikeOf(isString, isString)({ a: "a" }), true);
    assertEquals(isRecordLikeOf(isBoolean, isString)({ a: true }), true);
  });
  await t.step("returns false on non T record", () => {
    assertEquals(isRecordLikeOf(isString, isString)({ a: 0 }), false);
    assertEquals(isRecordLikeOf(isNumber, isString)({ a: "a" }), false);
    assertEquals(isRecordLikeOf(isString, isString)({ a: true }), false);
  });
  await t.step("returns false on non K record", () => {
    assertEquals(isRecordLikeOf(isNumber, isNumber)({ a: 0 }), false);
    assertEquals(isRecordLikeOf(isString, isNumber)({ a: "a" }), false);
    assertEquals(isRecordLikeOf(isBoolean, isNumber)({ a: true }), false);
  });
  await testWithExamples(
    t,
    isRecordLikeOf((_: unknown): _ is unknown => true),
    {
      excludeExamples: ["record", "date", "promise", "set", "map"],
    },
  );
});

Deno.test("isMapOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isMapOf(isNumber).name);
    await assertSnapshot(t, isMapOf((_x): _x is string => false).name);
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = new Map([["a", 0]]);
    if (isMapOf(isNumber)(a)) {
      assertType<Equal<typeof a, Map<unknown, number>>>(true);
    }
  });
  await t.step("returns true on T map", () => {
    assertEquals(isMapOf(isNumber)(new Map([["a", 0]])), true);
    assertEquals(isMapOf(isString)(new Map([["a", "a"]])), true);
    assertEquals(isMapOf(isBoolean)(new Map([["a", true]])), true);
  });
  await t.step("returns false on non T map", () => {
    assertEquals(isMapOf(isString)(new Map([["a", 0]])), false);
    assertEquals(isMapOf(isNumber)(new Map([["a", "a"]])), false);
    assertEquals(isMapOf(isString)(new Map([["a", true]])), false);
  });
  await testWithExamples(t, isMapOf((_: unknown): _ is unknown => true), {
    excludeExamples: ["map"],
  });
});

Deno.test("isMapOf<T, K>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isMapOf(isNumber, isString).name);
    await assertSnapshot(
      t,
      isMapOf((_x): _x is string => false, isString).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = new Map([["a", 0]]);
    if (isMapOf(isNumber, isString)(a)) {
      assertType<Equal<typeof a, Map<string, number>>>(true);
    }
  });
  await t.step("returns true on T map", () => {
    assertEquals(isMapOf(isNumber, isString)(new Map([["a", 0]])), true);
    assertEquals(isMapOf(isString, isString)(new Map([["a", "a"]])), true);
    assertEquals(isMapOf(isBoolean, isString)(new Map([["a", true]])), true);
  });
  await t.step("returns false on non T map", () => {
    assertEquals(isMapOf(isString, isString)(new Map([["a", 0]])), false);
    assertEquals(isMapOf(isNumber, isString)(new Map([["a", "a"]])), false);
    assertEquals(isMapOf(isString, isString)(new Map([["a", true]])), false);
  });
  await t.step("returns false on non K map", () => {
    assertEquals(isMapOf(isNumber, isNumber)(new Map([["a", 0]])), false);
    assertEquals(isMapOf(isString, isNumber)(new Map([["a", "a"]])), false);
    assertEquals(isMapOf(isBoolean, isNumber)(new Map([["a", true]])), false);
  });
  await testWithExamples(t, isMapOf((_: unknown): _ is unknown => true), {
    excludeExamples: ["map"],
  });
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
    assertEquals(
      isObjectOf({ 0: isString })(["a"]),
      false,
      "Value is not an object",
    );
  });
  await t.step("returns true on T instance", () => {
    const date = new Date();
    const predObj = {
      getFullYear: isFunction,
    };
    assertEquals(isObjectOf(predObj)(date), true, "Value is not an object");
  });
  await testWithExamples(
    t,
    isObjectOf({ a: (_: unknown): _ is unknown => false }),
    { excludeExamples: ["record"] },
  );
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
        b: isUnionOf([isString, isUndefined]),
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
        b: isUnionOf([isString, isUndefined]),
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
        b: isUnionOf([isString, isUndefined]),
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
      "Should return `isObjectOf`, if all predicates that",
    );
    await assertSnapshot(
      t,
      isIntersectionOf([
        isString,
      ]).name,
      "Should return as is, if there is only one predicate",
    );
    await assertSnapshot(
      t,
      isIntersectionOf([
        isFunction,
        isObjectOf({ b: isString }),
      ]).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const objPreds = [
      isObjectOf({ a: isNumber }),
      isObjectOf({ b: isString }),
    ] as const;
    const funcPreds = [
      isFunction,
      isObjectOf({ b: isString }),
    ] as const;
    const a: unknown = { a: 0, b: "a" };
    if (isIntersectionOf(objPreds)(a)) {
      assertType<Equal<typeof a, { a: number } & { b: string }>>(true);
    }
    if (isIntersectionOf([isString])(a)) {
      assertType<Equal<typeof a, string>>(true);
    }
    if (isIntersectionOf(funcPreds)(a)) {
      assertType<
        Equal<
          typeof a,
          & ((...args: unknown[]) => unknown)
          & { b: string }
        >
      >(true);
    }
  });
  await t.step("returns true on all of T", () => {
    const objPreds = [
      isObjectOf({ a: isNumber }),
      isObjectOf({ b: isString }),
    ] as const;
    const funcPreds = [
      isFunction,
      isObjectOf({ b: isString }),
    ] as const;
    const f = Object.assign(() => void 0, { b: "a" });
    assertEquals(isIntersectionOf(objPreds)({ a: 0, b: "a" }), true);
    assertEquals(isIntersectionOf([isString])("a"), true);
    assertEquals(isIntersectionOf(funcPreds)(f), true);
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
  await t.step("returns false on non of T with any predicates", async (t) => {
    const preds = [
      isFunction,
      isObjectOf({ b: isString }),
    ] as const;
    assertEquals(
      isIntersectionOf(preds)({ b: "a" }),
      false,
      "Not a function object",
    );
    assertEquals(
      isIntersectionOf(preds)(() => void 0),
      false,
      "Some properties does not exists in Function object",
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

Deno.test("is", async (t) => {
  const mod = await import("./is.ts");
  const casesOfAliasAndIsFunction = Object.entries(mod)
    .filter(([k, _]) => k.startsWith("is") && k !== "is")
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
