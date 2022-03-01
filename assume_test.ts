import { assertEquals, assertThrows } from "./deps_test.ts";
import {
  assume,
  assumeArray,
  assumeBoolean,
  assumeFunction,
  assumeLike,
  assumeNone,
  assumeNull,
  assumeNumber,
  assumeObject,
  assumeString,
  assumeUndefined,
} from "./assume.ts";
import { isBoolean, isNumber, isString } from "./is.ts";

Deno.test("assume returns the value when pred return true", () => {
  assertEquals(assume("a", isString), "a");
  assertEquals(assume(0, isNumber), 0);
});
Deno.test("assume throws error when pred return false", () => {
  assertThrows(() => assume("a", isNumber));
  assertThrows(() => assume(0, isString));
});

Deno.test("assumeString returns the value when the value is string", () => {
  assertEquals(assumeString("Hello"), "Hello");
});
Deno.test("assumeString throws error on non string", () => {
  assertThrows(() => assumeString(0));
  assertThrows(() => assumeString(true));
  assertThrows(() => assumeString(false));
  assertThrows(() => assumeString([]));
  assertThrows(() => assumeString({}));
  assertThrows(() => assumeString(function () {}));
  assertThrows(() => assumeString(undefined));
  assertThrows(() => assumeString(null));
});

Deno.test("assumeNumber returns the value when the value is number", () => {
  assertEquals(assumeNumber(0), 0);
  assertEquals(assumeNumber(1), 1);
  assertEquals(assumeNumber(0.1), 0.1);
});
Deno.test("assumeNumber throws error on non number", () => {
  assertThrows(() => assumeNumber("a"));
  assertThrows(() => assumeNumber(true));
  assertThrows(() => assumeNumber(false));
  assertThrows(() => assumeNumber([]));
  assertThrows(() => assumeNumber({}));
  assertThrows(() => assumeNumber(function () {}));
  assertThrows(() => assumeNumber(undefined));
  assertThrows(() => assumeNumber(null));
});

Deno.test("assumeBoolean returns the value when the value is boolean", () => {
  assertEquals(assumeBoolean(true), true);
  assertEquals(assumeBoolean(false), false);
});
Deno.test("assumeBoolean throws error on non boolean", () => {
  assertThrows(() => assumeBoolean(0));
  assertThrows(() => assumeBoolean("a"));
  assertThrows(() => assumeBoolean([]));
  assertThrows(() => assumeBoolean({}));
  assertThrows(() => assumeBoolean(function () {}));
  assertThrows(() => assumeBoolean(undefined));
  assertThrows(() => assumeBoolean(null));
});

Deno.test("assumeArray returns the value when the value is array", () => {
  assertEquals(assumeArray([]), []);
  assertEquals(assumeArray([0, 1, 2]), [0, 1, 2]);
  assertEquals(assumeArray(["a", "b", "c"]), ["a", "b", "c"]);
});
Deno.test("assumeArray throws error on non array", () => {
  assertThrows(() => assumeArray("a"));
  assertThrows(() => assumeArray(0));
  assertThrows(() => assumeArray(true));
  assertThrows(() => assumeArray(false));
  assertThrows(() => assumeArray({}));
  assertThrows(() => assumeArray(function () {}));
  assertThrows(() => assumeArray(undefined));
  assertThrows(() => assumeArray(null));
});
Deno.test("assumeArray<T> returns the value when the value is T array", () => {
  assertEquals(assumeArray([0, 1, 2], isNumber), [0, 1, 2]);
  assertEquals(assumeArray(["a", "b", "c"], isString), ["a", "b", "c"]);
  assertEquals(assumeArray([true, false, true], isBoolean), [
    true,
    false,
    true,
  ]);
});
Deno.test("assumeArray<T> throws error on non T array", () => {
  assertThrows(() => assumeArray([0, 1, 2], isString));
  assertThrows(() => assumeArray(["a", "b", "c"], isNumber));
  assertThrows(() => assumeArray([true, false, true], isString));
});

Deno.test("assumeObject return the value when the value is object", () => {
  assertEquals(assumeObject({}), {});
  assertEquals(assumeObject({ a: 0 }), { a: 0 });
  assertEquals(assumeObject({ a: "a" }), { a: "a" });
});
Deno.test("assumeObject throws error on non object", () => {
  assertThrows(() => assumeObject("a"));
  assertThrows(() => assumeObject(0));
  assertThrows(() => assumeObject(true));
  assertThrows(() => assumeObject(false));
  assertThrows(() => assumeObject([]));
  assertThrows(() => assumeObject(function () {}));
  assertThrows(() => assumeObject(undefined));
  assertThrows(() => assumeObject(null));
});
Deno.test(
  "assumeObject<T> returns the value when the value is T object",
  () => {
    assertEquals(assumeObject({ a: 0 }, isNumber), { a: 0 });
    assertEquals(assumeObject({ a: "a" }, isString), { a: "a" });
    assertEquals(assumeObject({ a: true }, isBoolean), { a: true });
  },
);
Deno.test("assumeObject<T> throws error on non T object", () => {
  assertThrows(() => assumeObject({ a: 0 }, isString));
  assertThrows(() => assumeObject({ a: "a" }, isNumber));
  assertThrows(() => assumeObject({ a: true }, isString));
});

Deno.test("assumeFunction returns the value when the value is function", () => {
  assertEquals(assumeFunction(assumeFunction), assumeFunction);
  const a = function () {};
  assertEquals(assumeFunction(a), a);
  const b = () => {};
  assertEquals(assumeFunction(b), b);
  assertEquals(assumeFunction(setTimeout), setTimeout);
});
Deno.test("assumeFunction throws error on non function", () => {
  assertThrows(() => assumeFunction("a"));
  assertThrows(() => assumeFunction(0));
  assertThrows(() => assumeFunction(true));
  assertThrows(() => assumeFunction(false));
  assertThrows(() => assumeFunction([]));
  assertThrows(() => assumeFunction({}));
  assertThrows(() => assumeFunction(undefined));
  assertThrows(() => assumeFunction(null));
});

Deno.test("assumeNull returns the value when the value is null", () => {
  assertEquals(assumeNull(null), null);
});
Deno.test("assumeNull throws error on non null", () => {
  assertThrows(() => assumeNull("a"));
  assertThrows(() => assumeNull(0));
  assertThrows(() => assumeNull(true));
  assertThrows(() => assumeNull(false));
  assertThrows(() => assumeNull([]));
  assertThrows(() => assumeNull({}));
  assertThrows(() => assumeNull(function () {}));
  assertThrows(() => assumeNull(undefined));
});

Deno.test(
  "assumeUndefined returns the value when the value is undefined",
  () => {
    assertEquals(assumeUndefined(undefined), undefined);
  },
);
Deno.test("assumeUndefined throws error on non undefined", () => {
  assertThrows(() => assumeUndefined("a"));
  assertThrows(() => assumeUndefined(0));
  assertThrows(() => assumeUndefined(true));
  assertThrows(() => assumeUndefined(false));
  assertThrows(() => assumeUndefined([]));
  assertThrows(() => assumeUndefined({}));
  assertThrows(() => assumeUndefined(function () {}));
  assertThrows(() => assumeUndefined(null));
});

Deno.test(
  "assumeNone returns the value when the value is null or undefined",
  () => {
    assertEquals(assumeNone(null), null);
    assertEquals(assumeNone(undefined), undefined);
  },
);
Deno.test("assumeNone throws error on non null nor undefined", () => {
  assertThrows(() => assumeNone("a"));
  assertThrows(() => assumeNone(0));
  assertThrows(() => assumeNone(true));
  assertThrows(() => assumeNone(false));
  assertThrows(() => assumeNone([]));
  assertThrows(() => assumeNone({}));
  assertThrows(() => assumeNone(function () {}));
});

Deno.test("assumeLike does it's job on string", () => {
  const ref = "";
  assertEquals(assumeLike(ref, "Hello"), "Hello");

  assertThrows(() => assumeLike(ref, 0));
  assertThrows(() => assumeLike(ref, true));
  assertThrows(() => assumeLike(ref, false));
  assertThrows(() => assumeLike(ref, []));
  assertThrows(() => assumeLike(ref, {}));
  assertThrows(() => assumeLike(ref, function () {}));
  assertThrows(() => assumeLike(ref, undefined));
  assertThrows(() => assumeLike(ref, null));
});
Deno.test("assumeLike does it's job on number", () => {
  const ref = 0;
  assertEquals(assumeLike(ref, 0), 0);
  assertEquals(assumeLike(ref, 1), 1);
  assertEquals(assumeLike(ref, 0.1), 0.1);

  assertThrows(() => assumeLike(ref, "a"));
  assertThrows(() => assumeLike(ref, true));
  assertThrows(() => assumeLike(ref, false));
  assertThrows(() => assumeLike(ref, []));
  assertThrows(() => assumeLike(ref, {}));
  assertThrows(() => assumeLike(ref, function () {}));
  assertThrows(() => assumeLike(ref, undefined));
  assertThrows(() => assumeLike(ref, null));
});
Deno.test("assumeLike does it's job on array", () => {
  const ref: unknown[] = [];
  assertEquals(assumeLike(ref, []), []);
  assertEquals(assumeLike(ref, [0, 1, 2]), [0, 1, 2]);
  assertEquals(assumeLike(ref, ["a", "b", "c"]), ["a", "b", "c"]);

  assertThrows(() => assumeLike(ref, "a"));
  assertThrows(() => assumeLike(ref, 0));
  assertThrows(() => assumeLike(ref, {}));
  assertThrows(() => assumeLike(ref, function () {}));
  assertThrows(() => assumeLike(ref, undefined));
  assertThrows(() => assumeLike(ref, null));
});
Deno.test("assumeLike does it's job on T array", () => {
  const ref: unknown[] = [];
  assertEquals(assumeLike(ref, [0, 1, 2], isNumber), [0, 1, 2]);
  assertEquals(assumeLike(ref, ["a", "b", "c"], isString), ["a", "b", "c"]);
  assertEquals(assumeLike(ref, [true, false, true], isBoolean), [
    true,
    false,
    true,
  ]);

  assertThrows(() => assumeLike(ref, [0, 1, 2], isString));
  assertThrows(() => assumeLike(ref, ["a", "b", "c"], isNumber));
  assertThrows(() => assumeLike(ref, [true, false, true], isString));
});
Deno.test("assumeLike does it's job on tuple", () => {
  const ref = ["", 0, ""];
  assertEquals(assumeLike(ref, ["", 0, ""]), ["", 0, ""]);
  assertEquals(assumeLike(ref, ["Hello", 100, "World"]), [
    "Hello",
    100,
    "World",
  ]);

  assertThrows(() => assumeLike(ref, ["Hello", 100, "World", "foo"]));
  assertThrows(() => assumeLike(ref, [0, 0, 0]));
  assertThrows(() => assumeLike(ref, ["", "", ""]));
  assertThrows(() => assumeLike(ref, [0, "", 0]));
});
Deno.test("assumeLike does it's job on object", () => {
  const ref = {};
  assertEquals(assumeLike(ref, {}), {});
  assertEquals(assumeLike(ref, { a: 0 }), { a: 0 });
  assertEquals(assumeLike(ref, { a: "a" }), { a: "a" });

  assertThrows(() => assumeLike(ref, "a"));
  assertThrows(() => assumeLike(ref, 0));
  assertThrows(() => assumeLike(ref, true));
  assertThrows(() => assumeLike(ref, false));
  assertThrows(() => assumeLike(ref, []));
  assertThrows(() => assumeLike(ref, function () {}));
  assertThrows(() => assumeLike(ref, undefined));
  assertThrows(() => assumeLike(ref, null));
});
Deno.test("assumeLike does it's job on T object", () => {
  const ref = {};
  assertEquals(assumeLike(ref, { a: 0 }, isNumber), { a: 0 });
  assertEquals(assumeLike(ref, { a: "a" }, isString), { a: "a" });
  assertEquals(assumeLike(ref, { a: true }, isBoolean), { a: true });

  assertThrows(() => assumeLike(ref, { a: 0 }, isString));
  assertThrows(() => assumeLike(ref, { a: "a" }, isNumber));
  assertThrows(() => assumeLike(ref, { a: true }, isString));
});
Deno.test("assumeLike does it's job on struct", () => {
  const ref = { foo: "", bar: 0 };
  assertEquals(assumeLike(ref, { foo: "", bar: 0 }), { foo: "", bar: 0 });
  assertEquals(assumeLike(ref, { foo: "", bar: 0, hoge: "" }), {
    foo: "",
    bar: 0,
    hoge: "",
  });

  assertThrows(() => assumeLike(ref, {}));
  assertThrows(() => assumeLike(ref, { foo: "" }));
  assertThrows(() => assumeLike(ref, { bar: 0 }));
});
Deno.test("assumeLike does it's job on function", () => {
  const ref = () => {};
  assertEquals(assumeLike(ref, assumeFunction), assumeFunction);
  const a = function () {};
  assertEquals(assumeLike(ref, a), a);
  const b = () => {};
  assertEquals(assumeLike(ref, b), b);
  assertEquals(assumeLike(ref, setTimeout), setTimeout);

  assertThrows(() => assumeLike(ref, "a"));
  assertThrows(() => assumeLike(ref, 0));
  assertThrows(() => assumeLike(ref, true));
  assertThrows(() => assumeLike(ref, false));
  assertThrows(() => assumeLike(ref, []));
  assertThrows(() => assumeLike(ref, {}));
  assertThrows(() => assumeLike(ref, undefined));
  assertThrows(() => assumeLike(ref, null));
});
Deno.test("assumeLike does it's job on null", () => {
  const ref = null;
  assertEquals(assumeLike(ref, null), null);

  assertThrows(() => assumeLike(ref, "a"));
  assertThrows(() => assumeLike(ref, 0));
  assertThrows(() => assumeLike(ref, true));
  assertThrows(() => assumeLike(ref, false));
  assertThrows(() => assumeLike(ref, []));
  assertThrows(() => assumeLike(ref, {}));
  assertThrows(() => assumeLike(ref, function () {}));
  assertThrows(() => assumeLike(ref, undefined));
});
Deno.test("assumeLike does it's job on undefined", () => {
  const ref = undefined;
  assertEquals(assumeLike(ref, undefined), undefined);

  assertThrows(() => assumeLike(ref, "a"));
  assertThrows(() => assumeLike(ref, 0));
  assertThrows(() => assumeLike(ref, true));
  assertThrows(() => assumeLike(ref, false));
  assertThrows(() => assumeLike(ref, []));
  assertThrows(() => assumeLike(ref, {}));
  assertThrows(() => assumeLike(ref, function () {}));
  assertThrows(() => assumeLike(ref, null));
});
