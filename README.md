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
- `isArray<T>(x: unknown, options?: { pred?: Predicate<T> }): x is T[]`
- `isObject<T>(x: unknown, options?: { pred?: Predicate<T> }): x is Record<string, T>`
- `isFunction(x: unknown): x is (...args: unknown[]) => unknown`
- `isNull(x: unknown): x is null`
- `isUndefined(x: unknown): x is undefined`
- `isNullish(x: unknown): x is null | undefined`

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

if (isArray(a, { pred: isString })) {
  // 'a' is 'string[]' in this block
}
```

### assertXXXXX

The `unknownutil` provides the following assert functions

- `assertString(x: unknown, options?: { message?: string }): assert x is string`
- `assertNumber(x: unknown, options?: { message?: string }): assert x is number`
- `assertBoolean(x: unknown, options?: { message?: string }): assert x is boolean`
- `assertArray<T>(x: unknown, options?: { message?: string, pred?: Predicate<T> }): assert x is T[]`
- `assertObject<T>(x: unknown, options?: { message?: string, pred?: Predicate<T> }): assert x is Record<string, T>`
- `assertFunction(x: unknown, options?: { message?: string }): assert x is (...args: unknown[]) => unknown`
- `assertNull(x: unknown, options?: { message?: string }): assert x is null`
- `assertUndefined(x: unknown, options?: { message?: string }): assert x is undefined`
- `assertNullish(x: unknown, options?: { message?: string }): assert x is null | undefined`

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
- `ensureArray<T>(x: unknown, options?: { pred?: Predicate<T> }): T[]`
- `ensureObject<T>(x: unknown, options?: { pred?: Predicate<T> }): Record<string, T>`
- `ensureFunction(x: unknown): (...args: unknown[]) => unknown`
- `ensureNull(x: unknown): null`
- `ensureUndefined(x: unknown): undefined`
- `ensureNullish(x: unknown): null | undefined`

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
- `maybeArray<T>(x: unknown, options?: { pred?: Predicate<T> }): T[] | undefined`
- `maybeObject<T>(x: unknown, options?: { pred?: Predicate<T> }): Record<string, T> | undefined`
- `maybeFunction(x: unknown): ((...args: unknown[]) => unknown) | undefined`

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

## License

The code follows MIT license written in [LICENSE](./LICENSE). Contributors need
to agree that any modifications sent in this repository follow the license.
