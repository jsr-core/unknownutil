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

- `ensure<T>(x: unknown, pred: Predicate<T>, message?: string): assert x is T`
- `ensureString(x: unknown): assert x is string`
- `ensureNumber(x: unknown): assert x is number`
- `ensureBoolean(x: unknown): assert x is boolean`
- `ensureArray<T extends unknown>(x: unknown, pred?: Predicate<T>): assert x is T[]`
- `ensureObject<T extends unknown>(x: unknown, pred?: Predicate<T>): x is Record<string, T>`
- `ensureFunction(x: unknown): x is (...args: unknown[]) => unknown`
- `ensureNull(x: unknown): x is null`
- `ensureUndefined(x: unknown): x is undefined`
- `ensureNone(x: unknown): x is null | undefined`

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

### assumeXXXXX

The `unknownutil` provides the following assume functions which returns a given
`x` as is or raise `EnsureError` when that is not expected type.

- `assume<T>(x: unknown, pred: Predicate<T>, message?: string): T`
- `assumeString(x: unknown): string`
- `assumeNumber(x: unknown): number`
- `assumeBoolean(x: unknown): boolean`
- `assumeArray<T extends unknown>(x: unknown, pred?: Predicate<T>): T[]`
- `assumeObject<T extends unknown>(x: unknown, pred?: Predicate<T>): Record<string, T>`
- `assumeFunction(x: unknown): (...args: unknown[]) => unknown`
- `assumeNull(x: unknown): null`
- `assumeUndefined(x: unknown): undefined`
- `assumeNone(x: unknown): null | undefined`

For example:

```typescript
import { assumeString } from "https://deno.land/x/unknownutil/mod.ts";

const a: unknown = "Hello";
const a1 = assumeString(a); // Now 'a' and 'a1' is 'string'

const b: unknown = 0;
const b1 = assumeString(b); // Raise EnsureError on above while 'b' is not string
```

Additionally, `assumeArray` and `assumeObject` supports an inner predicate
function to predicate `x` more precisely like:

```typescript
import { assumeArray, isString } from "https://deno.land/x/unknownutil/mod.ts";

const a: unknown = ["a", "b", "c"];
const a1 = assumeArray(a); // Now 'a' and 'a1' is 'unknown[]'
const a2 = assumeArray(a, isString); // Now 'a' and 'a2' is 'string[]'

const b: unknown = [0, 1, 2];
const b1 = assumeArray(b); // Now 'b' and 'b1' is 'unknown[]'
const b2 = assumeArray(b, isString); // Raise EnsureError on above while 'b' is not string array
```

Use `assumeLike` if you need some complicated types like tuple or struct like:

```typescript
import { assumeLike } from "https://deno.land/x/unknownutil/mod.ts";

const a: unknown = ["a", "b", "c"];
const a1 = assumeLike([], a); // Now 'a' and 'a1' is 'unknown[]'
const a2 = assumeLike(["", "", ""], a); // Now 'a' and 'a2' is '[string, string, string]'

const b: unknown = { foo: "foo", bar: 0 };
const b1 = assumeLike({}, b); // Now 'b' and 'b1' is 'Record<string, unknown>'
const b2 = assumeLike({ foo: "", bar: 0 }, b); // Now 'b' and 'b2' is '{foo: string, bar: number}'
```

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

Publish new version with:

```
npm version {major/minor/patch}
npm publish
git push --tags
```

## License

The code follows MIT license written in [LICENSE](./LICENSE). Contributors need
to agree that any modifications sent in this repository follow the license.
