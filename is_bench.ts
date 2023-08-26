import is from "./is.ts";

const cs: unknown[] = [
  "Hello world",
  12345,
  67890n,
  true,
  ["a", 1, true],
  ["a", "b", "c"],
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
  name: "is.ArrayOf",
  fn: () => {
    const pred = is.ArrayOf(is.String);
    for (const c of cs) {
      pred(c);
    }
  },
});

const isArrayOfPred = is.ArrayOf(is.String);
Deno.bench({
  name: "is.ArrayOf (pre)",
  fn: () => {
    for (const c of cs) {
      isArrayOfPred(c);
    }
  },
});

const predTup = [is.String, is.Number, is.Boolean] as const;
Deno.bench({
  name: "is.TupleOf",
  fn: () => {
    const pred = is.TupleOf(predTup);
    for (const c of cs) {
      pred(c);
    }
  },
});

const isTupleOfPred = is.TupleOf(predTup);
Deno.bench({
  name: "is.TupleOf (pre)",
  fn: () => {
    for (const c of cs) {
      isTupleOfPred(c);
    }
  },
});

Deno.bench({
  name: "is.UniformTupleOf",
  fn: () => {
    const pred = is.UniformTupleOf(3, is.String);
    for (const c of cs) {
      pred(c);
    }
  },
});

const isUniformTupleOfPred = is.UniformTupleOf(3, is.String);
Deno.bench({
  name: "is.UniformTupleOf (pre)",
  fn: () => {
    for (const c of cs) {
      isUniformTupleOfPred(c);
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
  name: "is.RecordOf",
  fn: () => {
    const pred = is.RecordOf(is.String);
    for (const c of cs) {
      pred(c);
    }
  },
});

const isRecordOfPred = is.RecordOf(is.String);
Deno.bench({
  name: "is.RecordOf (pre)",
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
  name: "is.ObjectOf",
  fn: () => {
    const pred = is.ObjectOf(predObj);
    for (const c of cs) {
      pred(c);
    }
  },
});

const isObjectOfPred = is.ObjectOf(predObj);
Deno.bench({
  name: "is.ObjectOf (pre)",
  fn: () => {
    for (const c of cs) {
      isObjectOfPred(c);
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
  name: "is.InstanceOf",
  fn: () => {
    const pred = is.InstanceOf(Date);
    for (const c of cs) {
      pred(c);
    }
  },
});

const isInstanceOfPred = is.InstanceOf(Date);
Deno.bench({
  name: "is.InstanceOf (pre)",
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
  name: "is.LiteralOf",
  fn: () => {
    const pred = is.LiteralOf(predLiteral);
    for (const c of cs) {
      pred(c);
    }
  },
});

const isLiteralOfPred = is.LiteralOf(predLiteral);
Deno.bench({
  name: "is.LiteralOf (pre)",
  fn: () => {
    for (const c of cs) {
      isLiteralOfPred(c);
    }
  },
});

const predsOne = [is.String, is.Number, is.Boolean] as const;
Deno.bench({
  name: "is.OneOf",
  fn: () => {
    const pred = is.OneOf(predsOne);
    for (const c of cs) {
      pred(c);
    }
  },
});

const isOneOfPred = is.OneOf(predsOne);
Deno.bench({
  name: "is.OneOf (pre)",
  fn: () => {
    for (const c of cs) {
      isOneOfPred(c);
    }
  },
});

const predsAll = [is.String, is.Number, is.Boolean] as const;
Deno.bench({
  name: "is.AllOf",
  fn: () => {
    const pred = is.AllOf(predsAll);
    for (const c of cs) {
      pred(c);
    }
  },
});

const isAllOfPred = is.AllOf(predsAll);
Deno.bench({
  name: "is.AllOf (pre)",
  fn: () => {
    for (const c of cs) {
      isAllOfPred(c);
    }
  },
});

Deno.bench({
  name: "is.OptionalOf",
  fn: () => {
    const pred = is.OptionalOf(is.String);
    for (const c of cs) {
      pred(c);
    }
  },
});

const isOptionalOfPred = is.OptionalOf(is.String);
Deno.bench({
  name: "is.OptionalOf (pre)",
  fn: () => {
    for (const c of cs) {
      isOptionalOfPred(c);
    }
  },
});
