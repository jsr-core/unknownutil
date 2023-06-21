import {
  assertEquals,
  assertStrictEquals,
} from "https://deno.land/std@0.192.0/testing/asserts.ts";
import is, {
  isArray,
  isArrayOf,
  isBoolean,
  isFunction,
  isNull,
  isNullish,
  isNumber,
  isObjectOf,
  isOneOf,
  isRecord,
  isRecordOf,
  isString,
  isTupleOf,
  isUndefined,
} from "./is.ts";

Deno.test("is defines aliases of functions", () => {
  assertStrictEquals(is.String, isString);
  assertStrictEquals(is.Number, isNumber);
  assertStrictEquals(is.Boolean, isBoolean);
  assertStrictEquals(is.Array, isArray);
  assertStrictEquals(is.ArrayOf, isArrayOf);
  assertStrictEquals(is.TupleOf, isTupleOf);
  assertStrictEquals(is.Record, isRecord);
  assertStrictEquals(is.RecordOf, isRecordOf);
  assertStrictEquals(is.ObjectOf, isObjectOf);
  assertStrictEquals(is.Function, isFunction);
  assertStrictEquals(is.Null, isNull);
  assertStrictEquals(is.Undefined, isUndefined);
  assertStrictEquals(is.Nullish, isNullish);
  assertStrictEquals(is.OneOf, isOneOf);
});

Deno.test("isString", async (t) => {
  await t.step("returns true on array", () => {
    assertEquals(isString(""), true);
    assertEquals(isString("Hello World"), true);
  });
  await t.step("returns false on non array", () => {
    assertEquals(isString(0), false);
    assertEquals(isString(true), false);
    assertEquals(isString(false), false);
    assertEquals(isString([]), false);
    assertEquals(isString({}), false);
    assertEquals(isString(function () {}), false);
    assertEquals(isString(null), false);
    assertEquals(isString(undefined), false);
  });
});

Deno.test("isNumber", async (t) => {
  await t.step("returns true on array", () => {
    assertEquals(isNumber(0), true);
    assertEquals(isNumber(1234567890), true);
  });
  await t.step("returns false on non array", () => {
    assertEquals(isNumber(""), false);
    assertEquals(isNumber(true), false);
    assertEquals(isNumber(false), false);
    assertEquals(isNumber([]), false);
    assertEquals(isNumber({}), false);
    assertEquals(isNumber(function () {}), false);
    assertEquals(isNumber(null), false);
    assertEquals(isNumber(undefined), false);
  });
});

Deno.test("isBoolean", async (t) => {
  await t.step("returns true on boolean", () => {
    assertEquals(isBoolean(true), true);
    assertEquals(isBoolean(false), true);
  });
  await t.step("returns false on non boolean", () => {
    assertEquals(isBoolean(0), false);
    assertEquals(isBoolean(""), false);
    assertEquals(isBoolean([]), false);
    assertEquals(isBoolean({}), false);
    assertEquals(isBoolean(function () {}), false);
    assertEquals(isBoolean(null), false);
    assertEquals(isBoolean(undefined), false);
  });
});

Deno.test("isArray", async (t) => {
  await t.step("returns true on array", () => {
    assertEquals(isArray([]), true);
    assertEquals(isArray([0, 1, 2]), true);
    assertEquals(isArray(["a", "b", "c"]), true);
    assertEquals(isArray([0, "a", 1]), true);
  });
  await t.step("returns false on non array", () => {
    assertEquals(isArray(""), false);
    assertEquals(isArray(0), false);
    assertEquals(isArray(true), false);
    assertEquals(isArray(false), false);
    assertEquals(isArray({}), false);
    assertEquals(isArray(function () {}), false);
    assertEquals(isArray(null), false);
    assertEquals(isArray(undefined), false);
  });
});

Deno.test("isArrayOf<T>", async (t) => {
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
  await t.step("returns proper type predicate", () => {
    const predTup = [isNumber, isString, isBoolean] as const;
    const a: unknown = [0, "a", true];
    if (isTupleOf(predTup)(a)) {
      const _: [number, string, boolean] = a;
    }
  });
});

Deno.test("isRecord", async (t) => {
  await t.step("returns true on record", () => {
    assertEquals(isRecord({}), true);
    assertEquals(isRecord({ a: 0 }), true);
    assertEquals(isRecord({ a: "a" }), true);
  });
  await t.step("returns false on non record", () => {
    assertEquals(isRecord(""), false);
    assertEquals(isRecord(0), false);
    assertEquals(isRecord(true), false);
    assertEquals(isRecord(false), false);
    assertEquals(isRecord([]), false);
    assertEquals(isRecord(function () {}), false);
    assertEquals(isRecord(null), false);
    assertEquals(isRecord(undefined), false);
  });
});

Deno.test("isRecordOf<T>", async (t) => {
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
  await t.step("returns proper type predicate", () => {
    const predObj = {
      a: isNumber,
      b: isString,
      c: isBoolean,
    };
    const a: unknown = { a: 0, b: "a", c: true };
    if (isObjectOf(predObj)(a)) {
      const _: { a: number; b: string; c: boolean } = a;
    }
  });
});

Deno.test("isFunction", async (t) => {
  await t.step("returns true on function", () => {
    assertEquals(isFunction(isFunction), true);
    assertEquals(isFunction(function () {}), true);
    assertEquals(isFunction(() => {}), true);
    assertEquals(isFunction(setTimeout), true);
  });
  await t.step("returns false on non function", () => {
    assertEquals(isFunction(""), false);
    assertEquals(isFunction(0), false);
    assertEquals(isFunction(true), false);
    assertEquals(isFunction(false), false);
    assertEquals(isFunction([]), false);
    assertEquals(isFunction({}), false);
    assertEquals(isFunction(null), false);
    assertEquals(isFunction(undefined), false);
  });
});

Deno.test("isNull", async (t) => {
  await t.step("returns true on null", () => {
    assertEquals(isNull(null), true);
  });
  await t.step("returns false on non null", () => {
    assertEquals(isNull(""), false);
    assertEquals(isNull(0), false);
    assertEquals(isNull(true), false);
    assertEquals(isNull(false), false);
    assertEquals(isNull([]), false);
    assertEquals(isNull({}), false);
    assertEquals(isNull(function () {}), false);
    assertEquals(isNull(undefined), false);
  });
});

Deno.test("isUndefined", async (t) => {
  await t.step("returns true on null", () => {
    assertEquals(isUndefined(undefined), true);
  });
  await t.step("returns false on non null", () => {
    assertEquals(isUndefined(""), false);
    assertEquals(isUndefined(0), false);
    assertEquals(isUndefined(true), false);
    assertEquals(isUndefined(false), false);
    assertEquals(isUndefined([]), false);
    assertEquals(isUndefined({}), false);
    assertEquals(isUndefined(function () {}), false);
    assertEquals(isUndefined(null), false);
  });
});

Deno.test("isNullish", async (t) => {
  await t.step("returns true on null/undefined", () => {
    assertEquals(isNullish(null), true);
    assertEquals(isNullish(undefined), true);
  });
  await t.step("returns false on non null/undefined", () => {
    assertEquals(isNullish(""), false);
    assertEquals(isNullish(0), false);
    assertEquals(isNullish(true), false);
    assertEquals(isNullish(false), false);
    assertEquals(isNullish([]), false);
    assertEquals(isNullish({}), false);
    assertEquals(isNullish(function () {}), false);
  });
});

Deno.test("isOneOf<T>", async (t) => {
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
  await t.step("returns proper type predicate", () => {
    const preds = [isNumber, isString, isBoolean];
    const a: unknown = [0, "a", true];
    if (isOneOf(preds)(a)) {
      const _: number | string | boolean = a;
    }
  });
});
