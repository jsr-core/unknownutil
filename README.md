# unknownutil

[![npm](http://img.shields.io/badge/available%20on-npm-lightgrey.svg?logo=npm&logoColor=white)](https://www.npmjs.com/package/unknownutil)
[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno)](https://deno.land/x/unknownutil)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/unknownutil/mod.ts)
[![Test](https://github.com/lambdalisue/deno-unknownutil/workflows/Test/badge.svg)](https://github.com/lambdalisue/deno-unknownutil/actions?query=workflow%3ATest)
[![npm version](https://badge.fury.io/js/unknownutil.svg)](https://badge.fury.io/js/unknownutil)

A utility pack for handling `unknown` type.

[deno]: https://deno.land/

## Usage

It provides `is` module for type predicate functions and `assert`, `ensure`, and
`maybe` helper functions.

### is*

Type predicate function is a function which returns `true` if a given value is
expected type. For example, `isString` (or `is.String`) returns `true` if a
given value is `string`.

```typescript
import { is } from "./mod.ts";

const a: unknown = "Hello";
if (is.String(a)) {
  // 'a' is 'string' in this block
}
```

Additionally, `is*Of` (or `is.*Of`) functions return type predicate functions to
predicate types of `x` more precisely like:

```typescript
import { is } from "./mod.ts";

const a: unknown = ["a", "b", "c"];

if (is.Array(a)) {
  // 'a' is 'unknown[]' in this block
}

if (is.ArrayOf(is.String)(a)) {
  // 'a' is 'string[]' in this block
}
```

### assert

The `assert` function does nothing if a given value is expected type. Otherwise,
it throws an `AssertError` exception like:

```typescript
import { assert, is } from "./mod.ts";

const a: unknown = "Hello";

// `assert` does nothing or throws an `AssertError`
assert(a, is.String);
// a is now narrowed to string

// With custom message
assert(a, is.String, { message: "a must be a string" });
```

### ensure

The `ensure` function return the value as-is if a given value is expected type.
Otherwise, it throws an `AssertError` exception like:

```typescript
import { ensure, is } from "./mod.ts";

const a: unknown = "Hello";

// `ensure` returns `string` or throws an `AssertError`
const _: string = ensure(a, is.String);

// With custom message
const __: string = ensure(a, is.String, { message: "a must be a string" });
```

### maybe

The `maybe` function return the value as-is if a given value is expected type.
Otherwise, it returns `undefined` that suites with
[nullish coalescing operator (`??`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
like:

```typescript
import { is, maybe } from "./mod.ts";

const a: unknown = "Hello";

// `maybe` returns `string | undefined` so it suites with `??`
const _: string = maybe(a, is.String) ?? "default value";
```

## Migration

See [GitHub Wiki](https://github.com/lambdalisue/deno-unknownutil/wiki) for
migration to v3 from v2 or v2 from v1.

## License

The code follows MIT license written in [LICENSE](./LICENSE). Contributors need
to agree that any modifications sent in this repository follow the license.
