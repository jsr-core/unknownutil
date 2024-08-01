import { testWithExamples } from "../_testutil.ts";
import { isAsyncFunction } from "./async_function.ts";

Deno.test("isAsyncFunction", async (t) => {
  await testWithExamples(t, isAsyncFunction, {
    validExamples: ["asyncFunction"],
  });
});
