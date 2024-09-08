import { assertEquals } from "@std/assert";
import { assertType, type IsExact } from "@std/testing/types";
import { isInstanceOf } from "./instance_of.ts";

Deno.test("isInstanceOf<T>", async (t) => {
  await t.step("returns properly named predicate function", () => {
    assertEquals(typeof isInstanceOf(Date), "function");
    assertEquals(isInstanceOf(Date).name, "isInstanceOf(Date)");
    assertEquals(isInstanceOf(class {}).name, "isInstanceOf((anonymous))");
  });

  await t.step("returns true on T instance", () => {
    class Cls {}
    assertEquals(isInstanceOf(Cls)(new Cls()), true);
    assertEquals(isInstanceOf(Date)(new Date()), true);
    assertEquals(isInstanceOf(Promise<string>)(new Promise(() => {})), true);
  });

  await t.step("returns false on non T instance", () => {
    class Cls {}
    assertEquals(isInstanceOf(Date)(new Cls()), false);
    assertEquals(isInstanceOf(Promise<string>)(new Date()), false);
    assertEquals(isInstanceOf(Cls)(new Promise(() => {})), false);
  });

  await t.step("predicated type is correct", () => {
    class Cls {}
    const a: unknown = undefined;

    if (isInstanceOf(Cls)(a)) {
      assertType<IsExact<typeof a, Cls>>(true);
    }

    if (isInstanceOf(Date)(a)) {
      assertType<IsExact<typeof a, Date>>(true);
    }

    if (isInstanceOf(Promise)(a)) {
      assertType<IsExact<typeof a, Promise<unknown>>>(true);
    }
  });
});
