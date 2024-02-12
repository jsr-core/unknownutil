import {
  assertEquals,
  assertStrictEquals,
} from "https://deno.land/std@0.211.0/assert/mod.ts";
import {
  assertSnapshot,
} from "https://deno.land/std@0.211.0/testing/snapshot.ts";
import { assertType } from "https://deno.land/std@0.211.0/testing/types.ts";
import { type Equal, stringify } from "./_testutil.ts";
import { type Predicate } from "./type.ts";
import { isArray, isBoolean, isNumber, isString } from "./core.ts";
import is, {
  isArrayOf,
  isInstanceOf,
  isLiteralOf,
  isLiteralOneOf,
  isMapOf,
  isObjectOf,
  isReadonlyTupleOf,
  isReadonlyUniformTupleOf,
  isRecordOf,
  isSetOf,
  isTupleOf,
  isUniformTupleOf,
} from "./factory.ts";

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

Deno.test("is", async (t) => {
  const mod = await import("./factory.ts");
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
