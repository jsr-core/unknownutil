# unknownutil

[![npm](http://img.shields.io/badge/available%20on-npm-lightgrey.svg?logo=npm&logoColor=white)](https://www.npmjs.com/package/unknownutil)
[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno)](https://deno.land/x/unknownutil)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/unknownutil/mod.ts)
[![Test](https://github.com/lambdalisue/deno-unknownutil/workflows/Test/badge.svg)](https://github.com/lambdalisue/deno-unknownutil/actions?query=workflow%3ATest)
[![npm version](https://badge.fury.io/js/unknownutil.svg)](https://badge.fury.io/js/unknownutil)

A utility pack for handling `unknown` type.

[deno]: https://deno.land/

## Usage

### isXXXXX

The `unknownutil` provides the following predicate functions

- `isString(x: unknown): x is string`
- `isNumber(x: unknown): x is number`
- `isBoolean(x: unknown): x is boolean`
- `isArray<T extends unknown>(x: unknown, pred?: Predicate<T>): x is T[]`
- `isObject<T extends unknown>(x: unknown, pred?: Predicate<T>): x is Record<string, T>`
- `isFunction(x: unknown): x is (...args: unknown[]) => unknown`
- `isNull(x: unknown): x is null`
- `isUndefined(x: unknown): x is undefined`
- `isNullish(x: unknown): x is null | undefined`
- `isLike<R, T extends unknown>(ref: R, x: unknown, pred?: Predicate<T>): x is R`

The above function can be used to check the type of any variable and guarantee
its type inside a closed `if` scope.

For example:

```typescript
import { isString } from "https://deno.land/x/unknownutil/mod.ts";

const a: unknown = "Hello";

if (isString(a)) {
  // 'a' is 'string' in this block
}
```

Additionally, `isArray` and `isObject` supports an inner predicate function to
predicate `x` more precisely like:

```typescript
import { isArray, isString } from "https://deno.land/x/unknownutil/mod.ts";

const a: unknown = ["a", "b", "c"];

if (isArray(a)) {
  // 'a' is 'unknown[]' in this block
}

if (isArray(a, isString)) {
  // 'a' is 'string[]' in this block
}
```

Use `isLike` if you need some complicated types like:

```typescript
import { isLike } from "https://deno.land/x/unknownutil/mod.ts";

const a: unknown = ["a", 0, "b"];
const b: unknown = ["a", 0, "b", "c"];

if (isLike(["", 0, ""], a)) {
  // 'a' is [string, number, string] thus this block is called
}

if (isLike(["", 0, ""], b)) {
  // 'b' is [string, number, string, string] thus this block is NOT called
}

const c: unknown = { foo: "foo", bar: 100 };
const d: unknown = { foo: "foo", bar: 100, hoge: "hoge" };
const e: unknown = { foo: "foo", hoge: "hoge" };

if (isLike({ foo: "", bar: 0 }, c)) {
  // 'c' is {foo: string, bar: number} thus this block is called
}

if (isLike({ foo: "", bar: 0 }, d)) {
  // 'd' contains {foo: string, bar: number} thus this block is called
}

if (isLike({ foo: "", bar: 0 }, e)) {
  // 'e' does not contain {foo: '', bar: 0} thus this block is NOT called
}
```

### assertXXXXX

The `unknownutil` provides the following assert functions

- `assertString(x: unknown): assert x is string`
- `assertNumber(x: unknown): assert x is number`
- `assertBoolean(x: unknown): assert x is boolean`
- `assertArray<T extends unknown>(x: unknown, pred?: Predicate<T>): assert x is T[]`
- `assertObject<T extends unknown>(x: unknown, pred?: Predicate<T>): assert x is Record<string, T>`
- `assertFunction(x: unknown): assert x is (...args: unknown[]) => unknown`
- `assertNull(x: unknown): assert x is null`
- `assertUndefined(x: unknown): assert x is undefined`
- `assertNullish(x: unknown): assert x is null | undefined`
- `assertLike<R, T extends unknown>(ref: R, x: unknown, pred?: Predicate<T>): assert x is R`

The above function can be used to guarantee the type of any variable by throwing
an exception if the type is not expected.

For example:

```typescript
import { assertString } from "https://deno.land/x/unknownutil/mod.ts";

function say(message: string): void {
  console.log(message);
}

const a: unknown = "Hello";
const b: unknown = 0;

// Because 'a' is 'unknown', TypeScript won't allow a code like below
//say(a);

// But once the 'assertString(a)' is passed, TypeScript knows that 'a' is 'string'
// thus it accepts the code that was not accepted before.
assertString(a);
say(a);

// Or raise 'AssertError' if a given value is not string
assertString(b);
say(b);
```

More complex type predications are available on `assertXXXXX` as well like
`isXXXXX`.

### ensureXXXXX

The `unknownutil` provides the following ensure functions

- `ensureString(x: unknown): string`
- `ensureNumber(x: unknown): number`
- `ensureBoolean(x: unknown): boolean`
- `ensureArray<T extends unknown>(x: unknown, pred?: Predicate<T>): T[]`
- `ensureObject<T extends unknown>(x: unknown, pred?: Predicate<T>): Record<string, T>`
- `ensureFunction(x: unknown): (...args: unknown[]) => unknown`
- `ensureNull(x: unknown): null`
- `ensureUndefined(x: unknown): undefined`
- `ensureNullish(x: unknown): null | undefined`
- `ensureLike<R, T extends unknown>(ref: R, x: unknown, pred?: Predicate<T>): R`

The above function can be used to guarantee the type of any variable by throwing
an exception if the type is not expected. The difference between assert and
ensure is whether to assert the argument or the return type.

For example:

```typescript
import { ensureString } from "https://deno.land/x/unknownutil/mod.ts";

function say(message: string): void {
  console.log(message);
}

const a: unknown = "Hello";
const b: unknown = 0;

// Because 'a' is 'unknown', TypeScript won't allow a code like below
//say(a);

// But once the 'ensureString(a)' is passed, TypeScript knows that return value is 'string'
// thus it accepts the code.
say(ensureString(a));

// Or raise 'AssertError' if a given value is not string
say(ensureString(b));
```

More complex type predications are available on `ensureXXXXX` as well like
`isXXXXX`.

### maybeXXXXX

The `unknownutil` provides the following maybe functions

- `maybeString(x: unknown): string | undefined`
- `maybeNumber(x: unknown): number | undefined`
- `maybeBoolean(x: unknown): boolean | undefined`
- `maybeArray<T extends unknown>(x: unknown, pred?: Predicate<T>): T[] | undefined`
- `maybeObject<T extends unknown>(x: unknown, pred?: Predicate<T>): Record<string, T> | undefined`
- `maybeFunction(x: unknown): ((...args: unknown[]) => unknown) | undefined`
- `maybeLike<R, T extends unknown>(ref: R, x: unknown, pred?: Predicate<T>): R | undefined`

The above function will return `undefined` if the type of any variable is not
expected, so it is possible to give an alternative value using the Nullish
coalescing operator (`??`).

For example:

```typescript
import { maybeString } from "https://deno.land/x/unknownutil/mod.ts";

function say(message: string): void {
  console.log(message);
}

const a: unknown = "Hello";
const b: unknown = 0;

// Because 'a' is 'unknown', TypeScript won't allow a code like below
//say(a);

// But the 'maybeString(a)' returns 'string | undefined' thus users can use
// Nullish coalescing operator to give an alternative value to ensure that the
// value given to the 'say()' is 'string'.
// The following code print "Hello" to the console.
say(maybeString(a) ?? "World");

// The following code print "World" to the console.
say(maybeString(b) ?? "World");
```

More complex type predications are available on `maybeXXXXX` as well like
`isXXXXX`.

## Migration from v1 to v2

1. Replace `ensure` or `assert` to corresponding specific functions (e.g.
   `ensureString` or `assertNumber`)
2. Rename `xxxxxNone` to `xxxxxNullish` (e.g. `isNone` to `isNullish`)
3. Rename `ensureXXXXX` to `assertXXXXX` (e.g. `ensureString` to `assertString`)
4. Rename `assumeXXXXX` to `ensureXXXXX` (e.g. `assumeNumber` to `ensureNumber`)

## Development

Lint code like:

```text
make lint
```

Format code like

```text
make fmt
```

Check types like

```text
make type-check
```

Run tests like:

```text
make test
```

## License

The code follows MIT license written in [LICENSE](./LICENSE). Contributors need
to agree that any modifications sent in this repository follow the license.
