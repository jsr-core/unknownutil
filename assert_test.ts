import { assertThrows } from "https://deno.land/std@0.186.0/testing/asserts.ts";
import {
  assertArray,
  assertBoolean,
  assertFunction,
  assertLike,
  assertNull,
  assertNullish,
  assertNumber,
  assertObject,
  assertString,
  assertUndefined,
} from "./assert.ts";
import { isBoolean, isNumber, isString } from "./is.ts";

Deno.test("assertString does nothing on string", () => {
  assertString("Hello");
});
Deno.test("assertString throws error on non string", () => {
  assertThrows(() => assertString(0));
  assertThrows(() => assertString(true));
  assertThrows(() => assertString(false));
  assertThrows(() => assertString([]));
  assertThrows(() => assertString({}));
  assertThrows(() => assertString(function () {}));
  assertThrows(() => assertString(undefined));
  assertThrows(() => assertString(null));
});

Deno.test("assertNumber does nothing on number", () => {
  assertNumber(0);
  assertNumber(1);
  assertNumber(0.1);
});
Deno.test("assertNumber throws error on non number", () => {
  assertThrows(() => assertNumber("a"));
  assertThrows(() => assertNumber(true));
  assertThrows(() => assertNumber(false));
  assertThrows(() => assertNumber([]));
  assertThrows(() => assertNumber({}));
  assertThrows(() => assertNumber(function () {}));
  assertThrows(() => assertNumber(undefined));
  assertThrows(() => assertNumber(null));
});

Deno.test("assertBoolean does nothing on boolean", () => {
  assertBoolean(true);
  assertBoolean(false);
});
Deno.test("assertBoolean throws error on non boolean", () => {
  assertThrows(() => assertBoolean(0));
  assertThrows(() => assertBoolean("a"));
  assertThrows(() => assertBoolean([]));
  assertThrows(() => assertBoolean({}));
  assertThrows(() => assertBoolean(function () {}));
  assertThrows(() => assertBoolean(undefined));
  assertThrows(() => assertBoolean(null));
});

Deno.test("assertArray does nothing on array", () => {
  assertArray([]);
  assertArray([0, 1, 2]);
  assertArray(["a", "b", "c"]);
});
Deno.test("assertArray throws error on non array", () => {
  assertThrows(() => assertArray("a"));
  assertThrows(() => assertArray(0));
  assertThrows(() => assertArray(true));
  assertThrows(() => assertArray(false));
  assertThrows(() => assertArray({}));
  assertThrows(() => assertArray(function () {}));
  assertThrows(() => assertArray(undefined));
  assertThrows(() => assertArray(null));
});
Deno.test("assertArray<T> does nothing on T array", () => {
  assertArray([0, 1, 2], isNumber);
  assertArray(["a", "b", "c"], isString);
  assertArray([true, false, true], isBoolean);
});
Deno.test("assertArray<T> throws error on non T array", () => {
  assertThrows(() => assertArray([0, 1, 2], isString));
  assertThrows(() => assertArray(["a", "b", "c"], isNumber));
  assertThrows(() => assertArray([true, false, true], isString));
});

Deno.test("assertObject does nothing on object", () => {
  assertObject({});
  assertObject({ a: 0 });
  assertObject({ a: "a" });
});
Deno.test("assertObject throws error on non object", () => {
  assertThrows(() => assertObject("a"));
  assertThrows(() => assertObject(0));
  assertThrows(() => assertObject(true));
  assertThrows(() => assertObject(false));
  assertThrows(() => assertObject([]));
  assertThrows(() => assertObject(function () {}));
  assertThrows(() => assertObject(undefined));
  assertThrows(() => assertObject(null));
});
Deno.test("assertObject<T> does nothing on T object", () => {
  assertObject({ a: 0 }, isNumber);
  assertObject({ a: "a" }, isString);
  assertObject({ a: true }, isBoolean);
});
Deno.test("assertObject<T> throws error on non T object", () => {
  assertThrows(() => assertObject({ a: 0 }, isString));
  assertThrows(() => assertObject({ a: "a" }, isNumber));
  assertThrows(() => assertObject({ a: true }, isString));
});

Deno.test("assertFunction does nothing on function", () => {
  assertFunction(assertFunction);
  assertFunction(function () {});
  assertFunction(() => {});
  assertFunction(setTimeout);
});
Deno.test("assertFunction throws error on non function", () => {
  assertThrows(() => assertFunction("a"));
  assertThrows(() => assertFunction(0));
  assertThrows(() => assertFunction(true));
  assertThrows(() => assertFunction(false));
  assertThrows(() => assertFunction([]));
  assertThrows(() => assertFunction({}));
  assertThrows(() => assertFunction(undefined));
  assertThrows(() => assertFunction(null));
});

Deno.test("assertNull does nothing on null", () => {
  assertNull(null);
});
Deno.test("assertNull throws error on non null", () => {
  assertThrows(() => assertNull("a"));
  assertThrows(() => assertNull(0));
  assertThrows(() => assertNull(true));
  assertThrows(() => assertNull(false));
  assertThrows(() => assertNull([]));
  assertThrows(() => assertNull({}));
  assertThrows(() => assertNull(function () {}));
  assertThrows(() => assertNull(undefined));
});

Deno.test("assertUndefined does nothing on undefined", () => {
  assertUndefined(undefined);
});
Deno.test("assertUndefined throws error on non undefined", () => {
  assertThrows(() => assertUndefined("a"));
  assertThrows(() => assertUndefined(0));
  assertThrows(() => assertUndefined(true));
  assertThrows(() => assertUndefined(false));
  assertThrows(() => assertUndefined([]));
  assertThrows(() => assertUndefined({}));
  assertThrows(() => assertUndefined(function () {}));
  assertThrows(() => assertUndefined(null));
});

Deno.test("assertNullish does nothing on null or undefined", () => {
  assertNullish(null);
  assertNullish(undefined);
});
Deno.test("assertNullish throws error on non null nor undefined", () => {
  assertThrows(() => assertNullish("a"));
  assertThrows(() => assertNullish(0));
  assertThrows(() => assertNullish(true));
  assertThrows(() => assertNullish(false));
  assertThrows(() => assertNullish([]));
  assertThrows(() => assertNullish({}));
  assertThrows(() => assertNullish(function () {}));
});

Deno.test("assertLike does it's job on string", () => {
  const ref = "";
  assertLike(ref, "Hello");

  assertThrows(() => assertLike(ref, 0));
  assertThrows(() => assertLike(ref, true));
  assertThrows(() => assertLike(ref, false));
  assertThrows(() => assertLike(ref, []));
  assertThrows(() => assertLike(ref, {}));
  assertThrows(() => assertLike(ref, function () {}));
  assertThrows(() => assertLike(ref, undefined));
  assertThrows(() => assertLike(ref, null));
});
Deno.test("assertLike does it's job on number", () => {
  const ref = 0;
  assertLike(ref, 0);
  assertLike(ref, 1);
  assertLike(ref, 0.1);

  assertThrows(() => assertLike(ref, "a"));
  assertThrows(() => assertLike(ref, true));
  assertThrows(() => assertLike(ref, false));
  assertThrows(() => assertLike(ref, []));
  assertThrows(() => assertLike(ref, {}));
  assertThrows(() => assertLike(ref, function () {}));
  assertThrows(() => assertLike(ref, undefined));
  assertThrows(() => assertLike(ref, null));
});
Deno.test("assertLike does it's job on array", () => {
  const ref: unknown[] = [];
  assertLike(ref, []);
  assertLike(ref, [0, 1, 2]);
  assertLike(ref, ["a", "b", "c"]);

  assertThrows(() => assertLike(ref, "a"));
  assertThrows(() => assertLike(ref, 0));
  assertThrows(() => assertLike(ref, {}));
  assertThrows(() => assertLike(ref, function () {}));
  assertThrows(() => assertLike(ref, undefined));
  assertThrows(() => assertLike(ref, null));
});
Deno.test("assertLike does it's job on T array", () => {
  const ref: unknown[] = [];
  assertLike(ref, [0, 1, 2], isNumber);
  assertLike(ref, ["a", "b", "c"], isString);
  assertLike(ref, [true, false, true], isBoolean);

  assertThrows(() => assertLike(ref, [0, 1, 2], isString));
  assertThrows(() => assertLike(ref, ["a", "b", "c"], isNumber));
  assertThrows(() => assertLike(ref, [true, false, true], isString));
});
Deno.test("assertLike does it's job on tuple", () => {
  const ref = ["", 0, ""];
  assertLike(ref, ["", 0, ""]);
  assertLike(ref, ["Hello", 100, "World"]);

  assertThrows(() => assertLike(ref, ["Hello", 100, "World", "foo"]));
  assertThrows(() => assertLike(ref, [0, 0, 0]));
  assertThrows(() => assertLike(ref, ["", "", ""]));
  assertThrows(() => assertLike(ref, [0, "", 0]));
});
Deno.test("assertLike does it's job on object", () => {
  const ref = {};
  assertLike(ref, {});
  assertLike(ref, { a: 0 });
  assertLike(ref, { a: "a" });

  assertThrows(() => assertLike(ref, "a"));
  assertThrows(() => assertLike(ref, 0));
  assertThrows(() => assertLike(ref, true));
  assertThrows(() => assertLike(ref, false));
  assertThrows(() => assertLike(ref, []));
  assertThrows(() => assertLike(ref, function () {}));
  assertThrows(() => assertLike(ref, undefined));
  assertThrows(() => assertLike(ref, null));
});
Deno.test("assertLike does it's job on T object", () => {
  const ref = {};
  assertLike(ref, { a: 0 }, isNumber);
  assertLike(ref, { a: "a" }, isString);
  assertLike(ref, { a: true }, isBoolean);

  assertThrows(() => assertLike(ref, { a: 0 }, isString));
  assertThrows(() => assertLike(ref, { a: "a" }, isNumber));
  assertThrows(() => assertLike(ref, { a: true }, isString));
});
Deno.test("assertLike does it's job on struct", () => {
  const ref = { foo: "", bar: 0 };
  assertLike(ref, { foo: "", bar: 0 });
  assertLike(ref, { foo: "", bar: 0, hoge: "" });

  assertThrows(() => assertLike(ref, {}));
  assertThrows(() => assertLike(ref, { foo: "" }));
  assertThrows(() => assertLike(ref, { bar: 0 }));
});
Deno.test("assertLike does it's job on function", () => {
  const ref = () => {};
  assertLike(ref, assertFunction);
  assertLike(ref, function () {});
  assertLike(ref, () => {});
  assertLike(ref, setTimeout);

  assertThrows(() => assertLike(ref, "a"));
  assertThrows(() => assertLike(ref, 0));
  assertThrows(() => assertLike(ref, true));
  assertThrows(() => assertLike(ref, false));
  assertThrows(() => assertLike(ref, []));
  assertThrows(() => assertLike(ref, {}));
  assertThrows(() => assertLike(ref, undefined));
  assertThrows(() => assertLike(ref, null));
});
Deno.test("assertLike does it's job on null", () => {
  const ref = null;
  assertLike(ref, null);

  assertThrows(() => assertLike(ref, "a"));
  assertThrows(() => assertLike(ref, 0));
  assertThrows(() => assertLike(ref, true));
  assertThrows(() => assertLike(ref, false));
  assertThrows(() => assertLike(ref, []));
  assertThrows(() => assertLike(ref, {}));
  assertThrows(() => assertLike(ref, function () {}));
  assertThrows(() => assertLike(ref, undefined));
});
Deno.test("assertLike does it's job on undefined", () => {
  const ref = undefined;
  assertLike(ref, undefined);

  assertThrows(() => assertLike(ref, "a"));
  assertThrows(() => assertLike(ref, 0));
  assertThrows(() => assertLike(ref, true));
  assertThrows(() => assertLike(ref, false));
  assertThrows(() => assertLike(ref, []));
  assertThrows(() => assertLike(ref, {}));
  assertThrows(() => assertLike(ref, function () {}));
  assertThrows(() => assertLike(ref, null));
});
