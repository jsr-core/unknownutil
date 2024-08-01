import { assertSnapshot } from "@std/testing/snapshot";
import { assertType } from "@std/testing/types";
import { type Equal, testWithExamples } from "../_testutil.ts";
import { is } from "../is/mod.ts";
import { asOptional, asUnoptional } from "./optional.ts";

Deno.test("asOptional<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, asOptional(is.Number).name);
    // Nesting does nothing
    await assertSnapshot(t, asOptional(asOptional(is.Number)).name);
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = undefined;
    if (is.ObjectOf({ a: asOptional(is.Number) })(a)) {
      assertType<Equal<typeof a, { a?: number }>>(true);
    }
  });
  await t.step("with is.String", async (t) => {
    await testWithExamples(t, asOptional(is.String), {
      validExamples: ["string", "undefined"],
    });
  });
  await t.step("with is.Number", async (t) => {
    await testWithExamples(t, asOptional(is.Number), {
      validExamples: ["number", "undefined"],
    });
  });
  await t.step("with is.Bigint", async (t) => {
    await testWithExamples(t, asOptional(is.Bigint), {
      validExamples: ["bigint", "undefined"],
    });
  });
  await t.step("with is.Boolean", async (t) => {
    await testWithExamples(t, asOptional(is.Boolean), {
      validExamples: ["boolean", "undefined"],
    });
  });
  await t.step("with is.Array", async (t) => {
    await testWithExamples(t, asOptional(is.Array), {
      validExamples: ["array", "undefined"],
    });
  });
  await t.step("with is.Set", async (t) => {
    await testWithExamples(t, asOptional(is.Set), {
      validExamples: ["set", "undefined"],
    });
  });
  await t.step("with is.RecordObject", async (t) => {
    await testWithExamples(t, asOptional(is.RecordObject), {
      validExamples: ["record", "undefined"],
    });
  });
  await t.step("with is.Function", async (t) => {
    await testWithExamples(t, asOptional(is.Function), {
      validExamples: ["syncFunction", "asyncFunction", "undefined"],
    });
  });
  await t.step("with is.SyncFunction", async (t) => {
    await testWithExamples(t, asOptional(is.SyncFunction), {
      validExamples: ["syncFunction", "undefined"],
    });
  });
  await t.step("with is.AsyncFunction", async (t) => {
    await testWithExamples(t, asOptional(is.AsyncFunction), {
      validExamples: ["asyncFunction", "undefined"],
    });
  });
  await t.step("with is.Null", async (t) => {
    await testWithExamples(t, asOptional(is.Null), {
      validExamples: ["null", "undefined"],
    });
  });
  await t.step("with is.Undefined", async (t) => {
    await testWithExamples(t, asOptional(is.Undefined), {
      validExamples: ["undefined"],
    });
  });
  await t.step("with is.Symbol", async (t) => {
    await testWithExamples(t, asOptional(is.Symbol), {
      validExamples: ["symbol", "undefined"],
    });
  });
});

Deno.test("asUnoptional<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, asUnoptional(asOptional(is.Number)).name);
    // Non optional does nothing
    await assertSnapshot(t, asUnoptional(is.Number).name);
    // Nesting does nothing
    await assertSnapshot(
      t,
      asUnoptional(asUnoptional(asOptional(is.Number))).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = undefined;
    if (is.ObjectOf({ a: asUnoptional(asOptional(is.Number)) })(a)) {
      assertType<Equal<typeof a, { a: number }>>(true);
    }
    if (asUnoptional(is.Number)(a)) {
      assertType<Equal<typeof a, number>>(true);
    }
  });
  await t.step("with is.String", async (t) => {
    await testWithExamples(t, asUnoptional(asOptional(is.String)), {
      validExamples: ["string"],
    });
  });
  await t.step("with is.Number", async (t) => {
    await testWithExamples(t, asUnoptional(asOptional(is.Number)), {
      validExamples: ["number"],
    });
  });
  await t.step("with is.Bigint", async (t) => {
    await testWithExamples(t, asUnoptional(asOptional(is.Bigint)), {
      validExamples: ["bigint"],
    });
  });
  await t.step("with is.Boolean", async (t) => {
    await testWithExamples(t, asUnoptional(asOptional(is.Boolean)), {
      validExamples: ["boolean"],
    });
  });
  await t.step("with is.Array", async (t) => {
    await testWithExamples(t, asUnoptional(asOptional(is.Array)), {
      validExamples: ["array"],
    });
  });
  await t.step("with is.Set", async (t) => {
    await testWithExamples(t, asUnoptional(asOptional(is.Set)), {
      validExamples: ["set"],
    });
  });
  await t.step("with is.RecordObject", async (t) => {
    await testWithExamples(
      t,
      asUnoptional(asOptional(is.RecordObject)),
      {
        validExamples: ["record"],
      },
    );
  });
  await t.step("with is.Function", async (t) => {
    await testWithExamples(t, asUnoptional(asOptional(is.Function)), {
      validExamples: ["syncFunction", "asyncFunction"],
    });
  });
  await t.step("with is.SyncFunction", async (t) => {
    await testWithExamples(
      t,
      asUnoptional(asOptional(is.SyncFunction)),
      {
        validExamples: ["syncFunction"],
      },
    );
  });
  await t.step("with is.AsyncFunction", async (t) => {
    await testWithExamples(
      t,
      asUnoptional(asOptional(is.AsyncFunction)),
      {
        validExamples: ["asyncFunction"],
      },
    );
  });
  await t.step("with is.Null", async (t) => {
    await testWithExamples(t, asUnoptional(asOptional(is.Null)), {
      validExamples: ["null"],
    });
  });
  await t.step("with is.Undefined", async (t) => {
    await testWithExamples(t, asUnoptional(asOptional(is.Undefined)), {
      validExamples: ["undefined"],
    });
  });
  await t.step("with is.Symbol", async (t) => {
    await testWithExamples(t, asUnoptional(asOptional(is.Symbol)), {
      validExamples: ["symbol"],
    });
  });
});
