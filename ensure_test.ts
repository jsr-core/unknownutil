import { assertThrows } from "./deps_test.ts";
import {
  ensure,
  ensureArray,
  ensureFunction,
  ensureLike,
  ensureNone,
  ensureNull,
  ensureNumber,
  ensureObject,
  ensureString,
  ensureUndefined,
} from "./ensure.ts";
import { isNumber, isString } from "./is.ts";

Deno.test("ensure does nothing when pred return true", () => {
  ensure("a", isString);
  ensure(0, isNumber);
});
Deno.test("ensure throws error when pred return false", () => {
  assertThrows(() => ensure("a", isNumber));
  assertThrows(() => ensure(0, isString));
});

Deno.test("ensureString does nothing on string", () => {
  ensureString("Hello");
});
Deno.test("ensureString throws error on non string", () => {
  assertThrows(() => ensureString(0));
  assertThrows(() => ensureString([]));
  assertThrows(() => ensureString({}));
  assertThrows(() => ensureString(function () {}));
  assertThrows(() => ensureString(undefined));
  assertThrows(() => ensureString(null));
});

Deno.test("ensureNumber does nothing on number", () => {
  ensureNumber(0);
  ensureNumber(1);
  ensureNumber(0.1);
});
Deno.test("ensureNumber throws error on non number", () => {
  assertThrows(() => ensureNumber("a"));
  assertThrows(() => ensureNumber([]));
  assertThrows(() => ensureNumber({}));
  assertThrows(() => ensureNumber(function () {}));
  assertThrows(() => ensureNumber(undefined));
  assertThrows(() => ensureNumber(null));
});

Deno.test("ensureArray does nothing on array", () => {
  ensureArray([]);
  ensureArray([0, 1, 2]);
  ensureArray(["a", "b", "c"]);
});
Deno.test("ensureArray throws error on non array", () => {
  assertThrows(() => ensureArray("a"));
  assertThrows(() => ensureArray(0));
  assertThrows(() => ensureArray({}));
  assertThrows(() => ensureArray(function () {}));
  assertThrows(() => ensureArray(undefined));
  assertThrows(() => ensureArray(null));
});
Deno.test("ensureArray<T> does nothing on T array", () => {
  ensureArray([0, 1, 2], isNumber);
  ensureArray(["a", "b", "c"], isString);
});
Deno.test("ensureArray<T> throws error on non T array", () => {
  assertThrows(() => ensureArray([0, 1, 2], isString));
  assertThrows(() => ensureArray(["a", "b", "c"], isNumber));
});

Deno.test("ensureObject does nothing on object", () => {
  ensureObject({});
  ensureObject({ a: 0 });
  ensureObject({ a: "a" });
});
Deno.test("ensureObject throws error on non object", () => {
  assertThrows(() => ensureObject("a"));
  assertThrows(() => ensureObject(0));
  assertThrows(() => ensureObject([]));
  assertThrows(() => ensureObject(function () {}));
  assertThrows(() => ensureObject(undefined));
  assertThrows(() => ensureObject(null));
});
Deno.test("ensureObject<T> does nothing on T object", () => {
  ensureObject({ a: 0 }, isNumber);
  ensureObject({ a: "a" }, isString);
});
Deno.test("ensureObject<T> throws error on non T object", () => {
  assertThrows(() => ensureObject({ a: 0 }, isString));
  assertThrows(() => ensureObject({ a: "a" }, isNumber));
});

Deno.test("ensureFunction does nothing on function", () => {
  ensureFunction(ensureFunction);
  ensureFunction(function () {});
  ensureFunction(() => {});
  ensureFunction(setTimeout);
});
Deno.test("ensureFunction throws error on non function", () => {
  assertThrows(() => ensureFunction("a"));
  assertThrows(() => ensureFunction(0));
  assertThrows(() => ensureFunction([]));
  assertThrows(() => ensureFunction({}));
  assertThrows(() => ensureFunction(undefined));
  assertThrows(() => ensureFunction(null));
});

Deno.test("ensureNull does nothing on null", () => {
  ensureNull(null);
});
Deno.test("ensureNull throws error on non null", () => {
  assertThrows(() => ensureNull("a"));
  assertThrows(() => ensureNull(0));
  assertThrows(() => ensureNull([]));
  assertThrows(() => ensureNull({}));
  assertThrows(() => ensureNull(function () {}));
  assertThrows(() => ensureNull(undefined));
});

Deno.test("ensureUndefined does nothing on undefined", () => {
  ensureUndefined(undefined);
});
Deno.test("ensureUndefined throws error on non undefined", () => {
  assertThrows(() => ensureUndefined("a"));
  assertThrows(() => ensureUndefined(0));
  assertThrows(() => ensureUndefined([]));
  assertThrows(() => ensureUndefined({}));
  assertThrows(() => ensureUndefined(function () {}));
  assertThrows(() => ensureUndefined(null));
});

Deno.test("ensureNone does nothing on null or undefined", () => {
  ensureNone(null);
  ensureNone(undefined);
});
Deno.test("ensureNone throws error on non null nor undefined", () => {
  assertThrows(() => ensureNone("a"));
  assertThrows(() => ensureNone(0));
  assertThrows(() => ensureNone([]));
  assertThrows(() => ensureNone({}));
  assertThrows(() => ensureNone(function () {}));
});

Deno.test("ensureLike does it's job on string", () => {
  const ref = "";
  ensureLike(ref, "Hello");

  assertThrows(() => ensureLike(ref, 0));
  assertThrows(() => ensureLike(ref, []));
  assertThrows(() => ensureLike(ref, {}));
  assertThrows(() => ensureLike(ref, function () {}));
  assertThrows(() => ensureLike(ref, undefined));
  assertThrows(() => ensureLike(ref, null));
});
Deno.test("ensureLike does it's job on number", () => {
  const ref = 0;
  ensureLike(ref, 0);
  ensureLike(ref, 1);
  ensureLike(ref, 0.1);

  assertThrows(() => ensureLike(ref, "a"));
  assertThrows(() => ensureLike(ref, []));
  assertThrows(() => ensureLike(ref, {}));
  assertThrows(() => ensureLike(ref, function () {}));
  assertThrows(() => ensureLike(ref, undefined));
  assertThrows(() => ensureLike(ref, null));
});
Deno.test("ensureLike does it's job on array", () => {
  const ref: unknown[] = [];
  ensureLike(ref, []);
  ensureLike(ref, [0, 1, 2]);
  ensureLike(ref, ["a", "b", "c"]);

  assertThrows(() => ensureLike(ref, "a"));
  assertThrows(() => ensureLike(ref, 0));
  assertThrows(() => ensureLike(ref, {}));
  assertThrows(() => ensureLike(ref, function () {}));
  assertThrows(() => ensureLike(ref, undefined));
  assertThrows(() => ensureLike(ref, null));
});
Deno.test("ensureLike does it's job on T array", () => {
  const ref: unknown[] = [];
  ensureLike(ref, [0, 1, 2], isNumber);
  ensureLike(ref, ["a", "b", "c"], isString);

  assertThrows(() => ensureLike(ref, [0, 1, 2], isString));
  assertThrows(() => ensureLike(ref, ["a", "b", "c"], isNumber));
});
Deno.test("ensureLike does it's job on tuple", () => {
  const ref = ["", 0, ""];
  ensureLike(ref, ["", 0, ""]);
  ensureLike(ref, ["Hello", 100, "World"]);

  assertThrows(() => ensureLike(ref, ["Hello", 100, "World", "foo"]));
  assertThrows(() => ensureLike(ref, [0, 0, 0]));
  assertThrows(() => ensureLike(ref, ["", "", ""]));
  assertThrows(() => ensureLike(ref, [0, "", 0]));
});
Deno.test("ensureLike does it's job on object", () => {
  const ref = {};
  ensureLike(ref, {});
  ensureLike(ref, { a: 0 });
  ensureLike(ref, { a: "a" });

  assertThrows(() => ensureLike(ref, "a"));
  assertThrows(() => ensureLike(ref, 0));
  assertThrows(() => ensureLike(ref, []));
  assertThrows(() => ensureLike(ref, function () {}));
  assertThrows(() => ensureLike(ref, undefined));
  assertThrows(() => ensureLike(ref, null));
});
Deno.test("ensureLike does it's job on T object", () => {
  const ref = {};
  ensureLike(ref, { a: 0 }, isNumber);
  ensureLike(ref, { a: "a" }, isString);

  assertThrows(() => ensureLike(ref, { a: 0 }, isString));
  assertThrows(() => ensureLike(ref, { a: "a" }, isNumber));
});
Deno.test("ensureLike does it's job on struct", () => {
  const ref = { foo: "", bar: 0 };
  ensureLike(ref, { foo: "", bar: 0 });
  ensureLike(ref, { foo: "", bar: 0, hoge: "" });

  assertThrows(() => ensureLike(ref, {}));
  assertThrows(() => ensureLike(ref, { foo: "" }));
  assertThrows(() => ensureLike(ref, { bar: 0 }));
});
Deno.test("ensureLike does it's job on function", () => {
  const ref = () => {};
  ensureLike(ref, ensureFunction);
  ensureLike(ref, function () {});
  ensureLike(ref, () => {});
  ensureLike(ref, setTimeout);

  assertThrows(() => ensureLike(ref, "a"));
  assertThrows(() => ensureLike(ref, 0));
  assertThrows(() => ensureLike(ref, []));
  assertThrows(() => ensureLike(ref, {}));
  assertThrows(() => ensureLike(ref, undefined));
  assertThrows(() => ensureLike(ref, null));
});
Deno.test("ensureLike does it's job on null", () => {
  const ref = null;
  ensureLike(ref, null);

  assertThrows(() => ensureLike(ref, "a"));
  assertThrows(() => ensureLike(ref, 0));
  assertThrows(() => ensureLike(ref, []));
  assertThrows(() => ensureLike(ref, {}));
  assertThrows(() => ensureLike(ref, function () {}));
  assertThrows(() => ensureLike(ref, undefined));
});
Deno.test("ensureLike does it's job on undefined", () => {
  const ref = undefined;
  ensureLike(ref, undefined);

  assertThrows(() => ensureLike(ref, "a"));
  assertThrows(() => ensureLike(ref, 0));
  assertThrows(() => ensureLike(ref, []));
  assertThrows(() => ensureLike(ref, {}));
  assertThrows(() => ensureLike(ref, function () {}));
  assertThrows(() => ensureLike(ref, null));
});
