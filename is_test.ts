import {
  assertEquals,
  assertStrictEquals,
} from "https://deno.land/std@0.202.0/testing/asserts.ts";
import type {
  AssertTrue,
  IsExact,
} from "https://deno.land/std@0.202.0/testing/types.ts";
import is, {
  isAllOf,
  isArray,
  isArrayOf,
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
  isRecord,
  isRecordOf,
  isString,
  isSymbol,
  isTupleOf,
  isUndefined,
  isUniformTupleOf,
  Predicate,
} from "./is.ts";

const examples = {
  string: ["", "Hello world"],
  number: [0, 1234567890],
  bigint: [0n, 1234567890n],
  boolean: [true, false],
  array: [[], [0, 1, 2], ["a", "b", "c"], [0, "a", true]],
  record: [{}, { a: 0, b: 1, c: 2 }, { a: "a", b: "b", c: "c" }],
  function: [function a() {}, () => {}],
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
  await t.step("returns proper type predicate", () => {
    const a: unknown = [0, 1, 2];
    if (isArrayOf(isNumber)(a)) {
      type _ = AssertTrue<IsExact<typeof a, number[]>>;
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

Deno.test("isTupleOf<T>", async (t) => {
  await t.step("returns proper type predicate", () => {
    const predTup = [isNumber, isString, isBoolean] as const;
    const a: unknown = [0, "a", true];
    if (isTupleOf(predTup)(a)) {
      type _ = AssertTrue<
        IsExact<typeof a, readonly [number, string, boolean]>
      >;
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

Deno.test("isUniformTupleOf<T>", async (t) => {
  await t.step("returns proper type predicate", () => {
    const a: unknown = [0, 1, 2, 3, 4];
    if (isUniformTupleOf(5)(a)) {
      type _ = AssertTrue<
        IsExact<
          typeof a,
          readonly [unknown, unknown, unknown, unknown, unknown]
        >
      >;
    }

    if (isUniformTupleOf(5, isNumber)(a)) {
      type _ = AssertTrue<
        IsExact<typeof a, readonly [number, number, number, number, number]>
      >;
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

Deno.test("isRecord", async (t) => {
  await testWithExamples(t, isRecord, {
    validExamples: ["record", "date", "promise"],
  });
});

Deno.test("isRecordOf<T>", async (t) => {
  await t.step("returns proper type predicate", () => {
    const a: unknown = { a: 0 };
    if (isRecordOf(isNumber)(a)) {
      type _ = AssertTrue<
        IsExact<typeof a, Record<string | number | symbol, number>>
      >;
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

Deno.test("isObjectOf<T>", async (t) => {
  await t.step("returns proper type predicate", () => {
    const predObj = {
      a: isNumber,
      b: isString,
      c: isBoolean,
    };
    const a: unknown = { a: 0, b: "a", c: true };
    if (isObjectOf(predObj)(a)) {
      type _ = AssertTrue<
        IsExact<typeof a, { a: number; b: string; c: boolean }>
      >;
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
        type _ = AssertTrue<
          IsExact<typeof a, { a: number; b: string | undefined; c?: boolean }>
        >;
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
  await testWithExamples(t, isFunction, { validExamples: ["function"] });
});

Deno.test("isInstanceOf<T>", async (t) => {
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
      type _ = AssertTrue<IsExact<typeof a, Cls>>;
    }

    const b: unknown = new Date();
    if (isInstanceOf(Date)(b)) {
      type _ = AssertTrue<IsExact<typeof b, Date>>;
    }

    const c: unknown = new Promise(() => {});
    if (isInstanceOf(Promise)(c)) {
      type _ = AssertTrue<IsExact<typeof c, Promise<unknown>>>;
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
  await t.step("returns proper type predicate", () => {
    const pred = "hello";
    const a: unknown = "hello";
    if (isLiteralOf(pred)(a)) {
      type _ = AssertTrue<IsExact<typeof a, "hello">>;
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
  await t.step("returns proper type predicate", () => {
    const preds = ["hello", "world"] as const;
    const a: unknown = "hello";
    if (isLiteralOneOf(preds)(a)) {
      type _ = AssertTrue<IsExact<typeof a, "hello" | "world">>;
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
  await t.step("returns proper type predicate", () => {
    const preds = [isNumber, isString, isBoolean];
    const a: unknown = [0, "a", true];
    if (isOneOf(preds)(a)) {
      type _ = AssertTrue<IsExact<typeof a, number | string | boolean>>;
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
  await t.step("returns proper type predicate", () => {
    const preds = [
      is.ObjectOf({ a: is.Number }),
      is.ObjectOf({ b: is.String }),
    ];
    const a: unknown = { a: 0, b: "a" };
    if (isAllOf(preds)(a)) {
      type _ = AssertTrue<IsExact<typeof a, { a: number; b: string }>>;
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
  await t.step("returns proper type predicate", () => {
    const a: unknown = undefined;
    if (isOptionalOf(isNumber)(a)) {
      type _ = AssertTrue<IsExact<typeof a, number | undefined>>;
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
      validExamples: ["function", "undefined"],
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
