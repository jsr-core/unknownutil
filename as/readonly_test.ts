import { assertSnapshot } from "@std/testing/snapshot";
import { assertType } from "@std/testing/types";
import type { Equal } from "../_testutil.ts";
import { is } from "../is/mod.ts";
import { asReadonly, asUnreadonly } from "./readonly.ts";

Deno.test("asReadonly<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, asReadonly(is.Number).name);
    // Nesting does nothing
    await assertSnapshot(t, asReadonly(asReadonly(is.Number)).name);
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = undefined;
    if (is.ObjectOf({ a: asReadonly(is.Number) })(a)) {
      assertType<Equal<typeof a, { readonly a: number }>>(true);
    }
  });
});

Deno.test("asUnreadonly<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, asUnreadonly(asReadonly(is.Number)).name);
    // Non optional does nothing
    await assertSnapshot(t, asUnreadonly(is.Number).name);
    // Nesting does nothing
    await assertSnapshot(
      t,
      asUnreadonly(asUnreadonly(asReadonly(is.Number))).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = undefined;
    if (is.ObjectOf({ a: asUnreadonly(asReadonly(is.Number)) })(a)) {
      assertType<Equal<typeof a, { a: number }>>(true);
    }
  });
});
