import {
  assertEquals,
  assertStrictEquals,
} from "https://deno.land/std@0.192.0/testing/asserts.ts";
import type {
  AssertTrue,
  IsExact,
} from "https://deno.land/std@0.192.0/testing/types.ts";
import is, {
  isArray,
  isArrayOf,
  isBigInt,
  isBoolean,
  isFunction,
  isInstanceOf,
  isNull,
  isNullish,
  isNumber,
  isObjectOf,
  isOneOf,
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
  function: [function () {}],
  null: [null],
  undefined: [undefined],
  symbol: [Symbol("a"), Symbol("b"), Symbol("c")],
};

function stringify(x: unknown): string {
  if (typeof x === "function") return x.toString();
  if (typeof x === "bigint") return `${x}n`;
  if (typeof x === "symbol") return x.toString();
  return JSON.stringify(x);
}

async function testWithExamples<T>(
  t: Deno.TestContext,
  pred: Predicate<T>,
  validExamples: (keyof typeof examples)[],
): Promise<void> {
  for (const [name, example] of Object.entries(examples)) {
    const expect = validExamples.includes(name as keyof typeof examples);
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
  await testWithExamples(t, isString, ["string"]);
});

Deno.test("isNumber", async (t) => {
  await testWithExamples(t, isNumber, ["number"]);
});

Deno.test("isBigInt", async (t) => {
  await testWithExamples(t, isBigInt, ["bigint"]);
});

Deno.test("isBoolean", async (t) => {
  await testWithExamples(t, isBoolean, ["boolean"]);
});

Deno.test("isArray", async (t) => {
  await testWithExamples(t, isArray, ["array"]);
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
  });
  await t.step("returns false on non T tuple", () => {
    const predTup = [isNumber, isString, isBoolean] as const;
    assertEquals(isTupleOf(predTup)([0, 1, 2]), false);
    assertEquals(isTupleOf(predTup)([0, "a"]), false);
    assertEquals(isTupleOf(predTup)([0, "a", true, 0]), false);
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
});

Deno.test("isRecord", async (t) => {
  await testWithExamples(t, isRecord, ["record"]);
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
      isObjectOf(predObj)({ a: 0, b: "a", c: true, d: "ignored" }),
      true,
    );
  });
  await t.step("returns false on non T object", () => {
    const predObj = {
      a: isNumber,
      b: isString,
      c: isBoolean,
    };
    assertEquals(isObjectOf(predObj)({ a: 0, b: "a", c: "" }), false);
    assertEquals(isObjectOf(predObj)({ a: 0, b: "a" }), false);
    assertEquals(
      isObjectOf(predObj, { strict: true })({
        a: 0,
        b: "a",
        c: true,
        d: "invalid",
      }),
      false,
    );
  });
});

Deno.test("isFunction", async (t) => {
  await testWithExamples(t, isFunction, ["function"]);
});

Deno.test("isInstanceOf<T>", async (t) => {
  await t.step("returns true on T instance", () => {
    class Cls {}
    assertEquals(isInstanceOf(Cls)(new Cls()), true);
    assertEquals(isInstanceOf(Date)(new Date()), true);
    assertEquals(isInstanceOf(Promise<string>)(new Promise(() => {})), true);
  });
  await t.step("returns false on non function", () => {
    class Cls {}
    assertEquals(isInstanceOf(Cls)(new Date()), false);
    assertEquals(isInstanceOf(Cls)(new Promise(() => {})), false);
    assertEquals(isInstanceOf(Cls)(""), false);
    assertEquals(isInstanceOf(Cls)(0), false);
    assertEquals(isInstanceOf(Cls)(true), false);
    assertEquals(isInstanceOf(Cls)(false), false);
    assertEquals(isInstanceOf(Cls)([]), false);
    assertEquals(isInstanceOf(Cls)({}), false);
    assertEquals(isInstanceOf(Cls)(function () {}), false);
    assertEquals(isInstanceOf(Cls)(null), false);
    assertEquals(isInstanceOf(Cls)(undefined), false);
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
  await testWithExamples(t, isNull, ["null"]);
});

Deno.test("isUndefined", async (t) => {
  await testWithExamples(t, isUndefined, ["undefined"]);
});

Deno.test("isNullish", async (t) => {
  await testWithExamples(t, isNullish, ["null", "undefined"]);
});

Deno.test("isSymbol", async (t) => {
  await testWithExamples(t, isSymbol, ["symbol"]);
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
  await t.step("returns false on non of T", () => {
    const preds = [isNumber, isString, isBoolean];
    assertEquals(isOneOf(preds)([]), false);
    assertEquals(isOneOf(preds)({}), false);
    assertEquals(isOneOf(preds)(function () {}), false);
    assertEquals(isOneOf(preds)(null), false);
    assertEquals(isOneOf(preds)(undefined), false);
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
      const aliases = casesOfAliasAndIsFunction.map(([a]) => a).toSorted();
      assertEquals(Object.keys(is).toSorted(), aliases);
    },
  );
});
