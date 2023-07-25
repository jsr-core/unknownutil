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

Deno.bench({
  name: "is.UniformTupleOf",
  fn: () => {
    const pred = is.UniformTupleOf(3, is.String);
    for (const c of cs) {
      pred(c);
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

const predObj = {
  a: is.String,
  b: is.Number,
  c: is.Boolean,
};
Deno.bench({
  name: "is.ObjectOf",
  fn: () => {
    const pred = is.ObjectOf(predObj);
    for (const c of cs) {
      pred(c);
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

const preds = [is.String, is.Number, is.Boolean];
Deno.bench({
  name: "is.OneOf",
  fn: () => {
    const pred = is.OneOf(preds);
    for (const c of cs) {
      pred(c);
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
