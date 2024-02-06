import is from "./is.ts";

const cs: unknown[] = [
  "Hello world",
  12345,
  67890n,
  true,
  ["a", 1, true],
  ["a", "b", "c"],
  new Set(["a", "b", "c"]),
  { a: "a", b: "b", c: "c" },
  { a: "a", b: 1, c: true },
  () => {},
  new Date(),
  null,
  undefined,
  Symbol("a"),
];

Deno.bench({
  name: "Warm-up",
  fn: () => {},
});

Deno.bench({
  name: "is.Any",
  fn: () => {
    for (const c of cs) {
      is.Any(c);
    }
  },
});

Deno.bench({
  name: "is.Unknown",
  fn: () => {
    for (const c of cs) {
      is.Unknown(c);
    }
  },
});

Deno.bench({
  name: "is.String",
  fn: () => {
    for (const c of cs) {
      is.String(c);
    }
  },
});

Deno.bench({
  name: "is.Number",
  fn: () => {
    for (const c of cs) {
      is.Number(c);
    }
  },
});

Deno.bench({
  name: "is.BigInt",
  fn: () => {
    for (const c of cs) {
      is.BigInt(c);
    }
  },
});

Deno.bench({
  name: "is.Boolean",
  fn: () => {
    for (const c of cs) {
      is.Boolean(c);
    }
  },
});

Deno.bench({
  name: "is.Array",
  fn: () => {
    for (const c of cs) {
      is.Array(c);
    }
  },
});

Deno.bench({
  name: "is.ArrayOf<T>",
  fn: () => {
    const pred = is.ArrayOf(is.String);
    for (const c of cs) {
      pred(c);
    }
  },
});

const isArrayOfPred = is.ArrayOf(is.String);
Deno.bench({
  name: "is.ArrayOf<T> (pre)",
  fn: () => {
    for (const c of cs) {
      isArrayOfPred(c);
    }
  },
});

Deno.bench({
  name: "is.Set",
  fn: () => {
    for (const c of cs) {
      is.Set(c);
    }
  },
});

Deno.bench({
  name: "is.SetOf<T>",
  fn: () => {
    const pred = is.SetOf(is.String);
    for (const c of cs) {
      pred(c);
    }
  },
});

const isSetOfPred = is.SetOf(is.String);
Deno.bench({
  name: "is.SetOf<T> (pre)",
  fn: () => {
    for (const c of cs) {
      isSetOfPred(c);
    }
  },
});

const predTup = [is.String, is.Number, is.Boolean] as const;
Deno.bench({
  name: "is.TupleOf<T>",
  fn: () => {
    const pred = is.TupleOf(predTup);
    for (const c of cs) {
      pred(c);
    }
  },
});

const isTupleOfPred = is.TupleOf(predTup);
Deno.bench({
  name: "is.TupleOf<T> (pre)",
  fn: () => {
    for (const c of cs) {
      isTupleOfPred(c);
    }
  },
});

Deno.bench({
  name: "is.TupleOf<T, E>",
  fn: () => {
    const pred = is.TupleOf(predTup, is.Array);
    for (const c of cs) {
      pred(c);
    }
  },
});

const isTupleOfElsePred = is.TupleOf(predTup, is.Array);
Deno.bench({
  name: "is.TupleOf<T, E> (pre)",
  fn: () => {
    for (const c of cs) {
      isTupleOfElsePred(c);
    }
  },
});

Deno.bench({
  name: "is.ReadonlyTupleOf<T>",
  fn: () => {
    const pred = is.ReadonlyTupleOf(predTup);
    for (const c of cs) {
      pred(c);
    }
  },
});

const isReadonlyTupleOfPred = is.ReadonlyTupleOf(predTup);
Deno.bench({
  name: "is.ReadonlyTupleOf<T> (pre)",
  fn: () => {
    for (const c of cs) {
      isReadonlyTupleOfPred(c);
    }
  },
});

Deno.bench({
  name: "is.ReadonlyTupleOf<T, E>",
  fn: () => {
    const pred = is.ReadonlyTupleOf(predTup, is.Array);
    for (const c of cs) {
      pred(c);
    }
  },
});

const isReadonlyTupleOfElsePred = is.ReadonlyTupleOf(predTup, is.Array);
Deno.bench({
  name: "is.ReadonlyTupleOf<T, E> (pre)",
  fn: () => {
    for (const c of cs) {
      isReadonlyTupleOfElsePred(c);
    }
  },
});

Deno.bench({
  name: "is.UniformTupleOf<N, T>",
  fn: () => {
    const pred = is.UniformTupleOf(3, is.String);
    for (const c of cs) {
      pred(c);
    }
  },
});

const isUniformTupleOfPred = is.UniformTupleOf(3, is.String);
Deno.bench({
  name: "is.UniformTupleOf<N, T> (pre)",
  fn: () => {
    for (const c of cs) {
      isUniformTupleOfPred(c);
    }
  },
});

Deno.bench({
  name: "is.ReadonlyUniformTupleOf<N, T>",
  fn: () => {
    const pred = is.ReadonlyUniformTupleOf(3, is.String);
    for (const c of cs) {
      pred(c);
    }
  },
});

const isReadonlyUniformTupleOfPred = is.ReadonlyUniformTupleOf(3, is.String);
Deno.bench({
  name: "is.ReadonlyUniformTupleOf<N, T> (pre)",
  fn: () => {
    for (const c of cs) {
      isReadonlyUniformTupleOfPred(c);
    }
  },
});

Deno.bench({
  name: "is.Record",
  fn: () => {
    for (const c of cs) {
      is.Record(c);
    }
  },
});

Deno.bench({
  name: "is.RecordOf<T>",
  fn: () => {
    const pred = is.RecordOf(is.String);
    for (const c of cs) {
      pred(c);
    }
  },
});

const isRecordOfPred = is.RecordOf(is.String);
Deno.bench({
  name: "is.RecordOf<T> (pre)",
  fn: () => {
    for (const c of cs) {
      isRecordOfPred(c);
    }
  },
});

const predObj = {
  a: is.String,
  b: is.Number,
  c: is.Boolean,
} as const;
Deno.bench({
  name: "is.ObjectOf<T>",
  fn: () => {
    const pred = is.ObjectOf(predObj);
    for (const c of cs) {
      pred(c);
    }
  },
});
Deno.bench({
  name: "is.ObjectOf<T> (strict)",
  fn: () => {
    const pred = is.ObjectOf(predObj, { strict: true });
    for (const c of cs) {
      pred(c);
    }
  },
});

const isObjectOfPred = is.ObjectOf(predObj);
Deno.bench({
  name: "is.ObjectOf<T> (pre)",
  fn: () => {
    for (const c of cs) {
      isObjectOfPred(c);
    }
  },
});

const isObjectOfStrictPred = is.ObjectOf(predObj, { strict: true });
Deno.bench({
  name: "is.ObjectOf<T> (pre, strict)",
  fn: () => {
    for (const c of cs) {
      isObjectOfStrictPred(c);
    }
  },
});

Deno.bench({
  name: "is.Function",
  fn: () => {
    for (const c of cs) {
      is.Function(c);
    }
  },
});

Deno.bench({
  name: "is.SyncFunction",
  fn: () => {
    for (const c of cs) {
      is.SyncFunction(c);
    }
  },
});

Deno.bench({
  name: "is.AsyncFunction",
  fn: () => {
    for (const c of cs) {
      is.AsyncFunction(c);
    }
  },
});

Deno.bench({
  name: "is.InstanceOf<T>",
  fn: () => {
    const pred = is.InstanceOf(Date);
    for (const c of cs) {
      pred(c);
    }
  },
});

const isInstanceOfPred = is.InstanceOf(Date);
Deno.bench({
  name: "is.InstanceOf<T> (pre)",
  fn: () => {
    for (const c of cs) {
      isInstanceOfPred(c);
    }
  },
});

Deno.bench({
  name: "is.Null",
  fn: () => {
    for (const c of cs) {
      is.Null(c);
    }
  },
});

Deno.bench({
  name: "is.Undefined",
  fn: () => {
    for (const c of cs) {
      is.Undefined(c);
    }
  },
});

Deno.bench({
  name: "is.Nullish",
  fn: () => {
    for (const c of cs) {
      is.Nullish(c);
    }
  },
});

Deno.bench({
  name: "is.Symbol",
  fn: () => {
    for (const c of cs) {
      is.Symbol(c);
    }
  },
});

Deno.bench({
  name: "is.Primitive",
  fn: () => {
    for (const c of cs) {
      is.Primitive(c);
    }
  },
});

const predLiteral = "hello";
Deno.bench({
  name: "is.LiteralOf<T>",
  fn: () => {
    const pred = is.LiteralOf(predLiteral);
    for (const c of cs) {
      pred(c);
    }
  },
});

const isLiteralOfPred = is.LiteralOf(predLiteral);
Deno.bench({
  name: "is.LiteralOf<T> (pre)",
  fn: () => {
    for (const c of cs) {
      isLiteralOfPred(c);
    }
  },
});

const predLiteralOne = ["hello", "world"] as const;
Deno.bench({
  name: "is.LiteralOneOf<T>",
  fn: () => {
    const pred = is.LiteralOneOf(predLiteralOne);
    for (const c of cs) {
      pred(c);
    }
  },
});

const isLiteralOneOfPred = is.LiteralOneOf(predLiteralOne);
Deno.bench({
  name: "is.LiteralOneOf<T> (pre)",
  fn: () => {
    for (const c of cs) {
      isLiteralOneOfPred(c);
    }
  },
});

const predsOne = [is.String, is.Number, is.Boolean] as const;
Deno.bench({
  name: "is.OneOf<T>",
  fn: () => {
    const pred = is.OneOf(predsOne);
    for (const c of cs) {
      pred(c);
    }
  },
});

const isOneOfPred = is.OneOf(predsOne);
Deno.bench({
  name: "is.OneOf<T> (pre)",
  fn: () => {
    for (const c of cs) {
      isOneOfPred(c);
    }
  },
});

const predsAll = [is.String, is.Number, is.Boolean] as const;
Deno.bench({
  name: "is.AllOf<T>",
  fn: () => {
    const pred = is.AllOf(predsAll);
    for (const c of cs) {
      pred(c);
    }
  },
});

const isAllOfPred = is.AllOf(predsAll);
Deno.bench({
  name: "is.AllOf<T> (pre)",
  fn: () => {
    for (const c of cs) {
      isAllOfPred(c);
    }
  },
});

Deno.bench({
  name: "is.OptionalOf<T>",
  fn: () => {
    const pred = is.OptionalOf(is.String);
    for (const c of cs) {
      pred(c);
    }
  },
});

const isOptionalOfPred = is.OptionalOf(is.String);
Deno.bench({
  name: "is.OptionalOf<T> (pre)",
  fn: () => {
    for (const c of cs) {
      isOptionalOfPred(c);
    }
  },
});
