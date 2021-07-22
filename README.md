# unknownutil

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno)](https://deno.land/x/unknownutil)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/unknownutil/mod.ts)
[![Test](https://github.com/lambdalisue/deno-unknownutil/workflows/Test/badge.svg)](https://github.com/lambdalisue/deno-unknownutil/actions?query=workflow%3ATest)

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
- `isNone(x: unknown): x is null | undefined`
- `isLike<R, T extends unknown>(ref: R, x: unknown, pred?: Predicate<T>): x is R`

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

Use `isLike` if you need some complicated types like tuple or struct like:

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

### ensureXXXXX

The `unknownutil` provides the following ensure functions which will raise
`EnsureError` when a given `x` is not expected type.

- `ensureString(x: unknown): assert x is string`
- `ensureNumber(x: unknown): assert x is string`
- `ensureBoolean(x: unknown): assert x is boolean`
- `ensureArray<T extends unknown>(x: unknown, pred?: Predicate<T>): assert x is T[]`
- `ensureObject<T extends unknown>(x: unknown, pred?: Predicate<T>): x ensure Record<string, T>`
- `ensureFunction(x: unknown): x ensure (...args: unknown[]) => unknown`
- `ensureNull(x: unknown): x ensure null`
- `ensureUndefined(x: unknown): x ensure undefined`
- `ensureNone(x: unknown): x ensure null | undefined`

For example:

```typescript
import { ensureString } from "https://deno.land/x/unknownutil/mod.ts";

const a: unknown = "Hello";
ensureString(a); // Now 'a' is 'string'

const b: unknown = 0;
ensureString(b); // Raise EnsureError on above while 'b' is not string
```

Additionally, `ensureArray` and `ensureObject` supports an inner predicate
function to predicate `x` more precisely like:

```typescript
import { ensureArray, isString } from "https://deno.land/x/unknownutil/mod.ts";

const a: unknown = ["a", "b", "c"];
ensureArray(a); // Now 'a' is 'unknown[]'
ensureArray(a, isString); // Now 'a' is 'string[]'

const b: unknown = [0, 1, 2];
ensureArray(b); // Now 'b' is 'unknown[]'
ensureArray(b, isString); // Raise EnsureError on above while 'b' is not string array
```

Use `ensureLike` if you need some complicated types like tuple or struct like:

```typescript
import { ensureLike } from "https://deno.land/x/unknownutil/mod.ts";

const a: unknown = ["a", "b", "c"];
ensureLike([], a); // Now 'a' is 'unknown[]'
ensureLike(["", "", ""], a); // Now 'a' is '[string, string, string]'

const b: unknown = { foo: "foo", bar: 0 };
ensureLike({}, b); // Now 'b' is 'Record<string, unknown>'
ensureLike({ foo: "", bar: 0 }, b); // Now 'b' is '{foo: string, bar: number}'
```

## License

The code follows MIT license written in [LICENSE](./LICENSE). Contributors need
to agree that any modifications sent in this repository follow the license.
