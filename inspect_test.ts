import { assertSnapshot } from "@std/testing/snapshot";
import { inspect } from "./inspect.ts";

Deno.test("inspect", async (t) => {
  await t.step("string", async (t) => {
    await assertSnapshot(t, inspect("hello world"));
  });
  await t.step("number", async (t) => {
    await assertSnapshot(t, inspect(100));
  });
  await t.step("bigint", async (t) => {
    await assertSnapshot(t, inspect(100n));
  });
  await t.step("boolean", async (t) => {
    await assertSnapshot(t, inspect(true));
  });
  await t.step("array", async (t) => {
    await assertSnapshot(t, inspect([]));
    await assertSnapshot(t, inspect([0, 1, 2]));
    await assertSnapshot(t, inspect([0, "a", true]));
    await assertSnapshot(t, inspect([0, [1, [2]]]));
  });
  await t.step("record", async (t) => {
    await assertSnapshot(t, inspect({}));
    await assertSnapshot(t, inspect({ a: 0, b: 1, c: 2 }));
    await assertSnapshot(t, inspect({ a: "a", b: 1, c: true }));
    await assertSnapshot(t, inspect({ a: { b: { c: 0 } } }));
  });
  await t.step("function", async (t) => {
    await assertSnapshot(t, inspect(inspect));
    await assertSnapshot(t, inspect(() => {}));
  });
  await t.step("null", async (t) => {
    await assertSnapshot(t, inspect(null));
  });
  await t.step("undefined", async (t) => {
    await assertSnapshot(t, inspect(undefined));
  });
  await t.step("symbol", async (t) => {
    await assertSnapshot(t, inspect(Symbol("a")));
  });
  await t.step("date", async (t) => {
    await assertSnapshot(t, inspect(new Date()));
  });
  await t.step("promise", async (t) => {
    await assertSnapshot(t, inspect(new Promise(() => {})));
  });
});
