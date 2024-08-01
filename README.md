# unknownutil

[![jsr](https://jsr.io/badges/@core/unknownutil)](https://jsr.io/@core/unknownutil)
[![test](https://github.com/jsr-core/unknownutil/workflows/Test/badge.svg)](https://github.com/jsr-core/unknownutil/actions?query=workflow%3ATest)
[![codecov](https://codecov.io/github/jsr-core/unknownutil/graph/badge.svg?token=pfbLRGU5AM)](https://codecov.io/github/jsr-core/unknownutil)

A utility pack for handling `unknown` type.

[jsr.io]: https://jsr.io/@core/unknownutil

## Usage

It provides `is` module for type predicate functions and `assert`, `ensure`, and
`maybe` helper functions.

### is\*

Type predicate function is a function which returns `true` if a given value is
expected type. For example, `isString` (or `is.String`) returns `true` if a
given value is `string`.

```typescript
import { is } from "@core/unknownutil";

const a: unknown = "Hello";
if (is.String(a)) {
  // 'a' is 'string' in this block
}
```

For more complex types, you can use `is*Of` (or `is.*Of`) functions like:

```typescript
import { as, is, PredicateType } from "@core/unknownutil";

const isArticle = is.ObjectOf({
  title: is.String,
  body: is.String,
  refs: is.ArrayOf(
    is.UnionOf([
      is.String,
      is.ObjectOf({
        name: is.String,
        url: is.String,
      }),
    ]),
  ),
  createTime: as.Optional(is.InstanceOf(Date)),
  updateTime: as.Optional(is.InstanceOf(Date)),
});

// Infer the type of `Article` from the definition of `isArticle`
type Article = PredicateType<typeof isArticle>;

const a: unknown = {
  title: "Awesome article",
  body: "This is an awesome article",
  refs: [{ name: "Deno", url: "https://deno.land/" }, "https://github.com"],
};
if (isArticle(a)) {
  // a is narrowed to the type of `isArticle`
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
`isObjectOf` with `isPickOf`, `isOmitOf`, `isPartialOf`, and `isRequiredOf`
similar to TypeScript's `Pick`, `Omit`, `Partial`, `Required` utility types.

```typescript
import { as, is } from "@core/unknownutil";

const isArticle = is.ObjectOf({
  title: is.String,
  body: is.String,
  refs: is.ArrayOf(
    is.UnionOf([
      is.String,
      is.ObjectOf({
        name: is.String,
        url: is.String,
      }),
    ]),
  ),
  createTime: as.Optional(is.InstanceOf(Date)),
  updateTime: as.Optional(is.InstanceOf(Date)),
});

const isArticleCreateParams = is.PickOf(isArticle, ["title", "body", "refs"]);
// is equivalent to
//const isArticleCreateParams = is.ObjectOf({
//  title: is.String,
//  body: is.String,
//  refs: is.ArrayOf(
//    is.UnionOf([
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
//    is.UnionOf([
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
//  body: as.Optional(is.String),
//  refs: as.Optional(is.ArrayOf(
//    is.UnionOf([
//      is.String,
//      is.ObjectOf({
//        name: is.String,
//        url: is.String,
//      }),
//    ]),
//  )),
//});

const isArticleAvailableParams = is.RequiredOf(isArticle);
// is equivalent to
//const isArticlePutParams = is.ObjectOf({
//  body: is.String,
//  refs: is.ArrayOf(
//    is.UnionOf([
//      is.String,
//      is.ObjectOf({
//        name: is.String,
//        url: is.String,
//      }),
//    ]),
//  ),
//  createTime: is.InstanceOf(Date),
//  updateTime: is.InstanceOf(Date),
//});
```

If you need an union type or an intersection type, use `isUnionOf` and
`isIntersectionOf` like:

```typescript
import { is } from "@core/unknownutil";

const isFoo = is.ObjectOf({
  foo: is.String,
});

const isBar = is.ObjectOf({
  bar: is.String,
});

const isFooOrBar = is.UnionOf([isFoo, isBar]);
// { foo: string } | { bar: string }

const isFooAndBar = is.IntersectionOf([isFoo, isBar]);
// { foo: string } & { bar: string }
```

### assert

The `assert` function does nothing if a given value is expected type. Otherwise,
it throws an `AssertError` exception like:

```typescript
import { assert, is } from "@core/unknownutil";

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
import { ensure, is } from "@core/unknownutil";

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
import { is, maybe } from "@core/unknownutil";

const a: unknown = "Hello";

// `maybe` returns `string | undefined` so it suites with `??`
const _: string = maybe(a, is.String) ?? "default value";
```

## Migration

See [GitHub Wiki](https://github.com/jsr-core/unknownutil/wiki) for migration to
v3 from v2 or v2 from v1.

## License

The code follows MIT license written in [LICENSE](./LICENSE). Contributors need
to agree that any modifications sent in this repository follow the license.
