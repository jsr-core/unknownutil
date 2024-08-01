import { testWithExamples } from "../_testutil.ts";
import { isFunction } from "./function.ts";

Deno.test("isFunction", async (t) => {
  await testWithExamples(t, isFunction, {
    validExamples: ["syncFunction", "asyncFunction"],
  });
});
