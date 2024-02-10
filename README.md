# unknownutil

[![npm](http://img.shields.io/badge/available%20on-npm-lightgrey.svg?logo=npm&logoColor=white)](https://www.npmjs.com/package/unknownutil)
[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno)](https://deno.land/x/unknownutil)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/unknownutil/mod.ts)
[![Test](https://github.com/lambdalisue/deno-unknownutil/workflows/Test/badge.svg)](https://github.com/lambdalisue/deno-unknownutil/actions?query=workflow%3ATest)
[![npm version](https://badge.fury.io/js/unknownutil.svg)](https://badge.fury.io/js/unknownutil)
[![codecov](https://codecov.io/github/lambdalisue/deno-unknownutil/graph/badge.svg?token=pfbLRGU5AM)](https://codecov.io/github/lambdalisue/deno-unknownutil)

A utility pack for handling the `unknown` type.

[deno]: https://deno.land/

## Usage

It provides a `is` module for type predicate functions and `assert`, `ensure`,
and `maybe` helper functions.

### is\*

A type predicate function is a function that returns `true` if a given value is
of the expected type. For example, `isString` (or `is.String`) returns `true` if
a given value is a `string`.

```typescript
import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";

const a: unknown = "Hello";
if (is.String(a)) {
  // 'a' is a 'string' in this block
}
```

For more complex types, you can use `is*Of` (or `is.*Of`) functions like:

```typescript
import {
  is,
  PredicateType,
} from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";

const isArticle = is.ObjectOf({
  title: is.String,
  body: is.String,
  refs: is.ArrayOf(
    is.OneOf([
      is.String,
      is.ObjectOf({
        name: is.String,
        url: is.String,
      }),
    ]),
  ),
  createTime: is.OptionalOf(is.InstanceOf(Date)),
  updateTime: is.OptionalOf(is.InstanceOf(Date)),
});

// Infer the type of `Article` from the definition of `isArticle`
type Article = PredicateType<typeof isArticle>;

const a: unknown = {
  title: "Awesome article",
  body: "This is an awesome article",
  refs: [{ name: "Deno", url: "https://deno.land/" }, "https://github.com"],
};
if (isArticle(a)) {
  // 'a' is narrowed to the type of `isArticle`
  console.log(a.title);
  console.log(a.body);
  for (const ref of a.refs) {
    if (is.String(ref)) {
      console.log(ref);
    } else {
      console.log(ref.name);
      console.log(ref.url);
    }
  }
}
```

Additionally, you can manipulate the predicate function returned from
`isObjectOf` with `isPickOf`, `isOmitOf`, and `isPartialOf` similar to
TypeScript's `Pick`, `Omit`, and `Partial` utility types.

```typescript
import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";

const isArticle = is.ObjectOf({
  title: is.String,
  body: is.String,
  refs: is.ArrayOf(
    is.OneOf([
      is.String,
      is.ObjectOf({
        name: is.String,
        url: is.String,
      }),
    ]),
  ),
  createTime: is.OptionalOf(is.InstanceOf(Date)),
  updateTime: is.OptionalOf(is.InstanceOf(Date)),
});

const isArticleCreateParams = is.PickOf(isArticle, ["title", "body", "refs"]);
// is equivalent to
//const isArticleCreateParams = is.ObjectOf({
//  title: is.String,
//  body: is.String,
//  refs: is.ArrayOf(
//    is.OneOf([
//      is.String,
//      is.ObjectOf({
//        name: is.String,
//        url: is.String,
//      }),
//    ]),
//  ),
//});

const isArticleUpdateParams = is.OmitOf(isArticleCreateParams, ["title"]);
// is equivalent to
//const isArticleUpdateParams = is.ObjectOf({
//  body: is.String,
//  refs: is.ArrayOf(
//    is.OneOf([
//      is.String,
//      is.ObjectOf({
//        name: is.String,
//        url: is.String,
//      }),
//    ]),
//  ),
//});

const isArticlePatchParams = is.PartialOf(isArticleUpdateParams);
// is equivalent to
//const isArticlePatchParams = is.ObjectOf({
//  body: is.Optional(is.String),
//  refs: is.Optional(is.ArrayOf(
//    is.OneOf([
//      is.String,
//      is.ObjectOf({
//        name: is.String,
//        url: is.String,
//      }),
//    ]),
//  )),
//});
```

See [Deno Doc](https://doc.deno.land/https/deno.land/x/unknownutil/mod.ts) for
the list of available type predicate functions.

### assert

The `assert` function does nothing if a given value is of the expected type.
Otherwise, it throws an `AssertError` exception like:

```typescript
import {
  assert,
  is,
} from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";

const a: unknown = "Hello";

// `assert` does nothing or throws an `AssertError`
assert(a, is.String);
// 'a' is now narrowed to a 'string'

// With a custom message
assert(a, is.String, { message: "a must be a string" });
```

### ensure

The `ensure` function returns the value as-is if a given value is of the
expected type. Otherwise, it throws an `AssertError` exception like:

```typescript
import {
  ensure,
  is,
} from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";

const a: unknown = "Hello";

// `ensure` returns `string` or throws an `AssertError`
const _: string = ensure(a, is.String);

// With a custom message
const __: string = ensure(a, is.String, { message: "a must be a string" });
```

### maybe

The `maybe` function returns the value as-is if a given value is of the expected
type. Otherwise, it returns `undefined`, which is suitable for use with the
[nullish coalescing operator (`??`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
like:

```typescript
import {
  is,
  maybe,
} from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
```
