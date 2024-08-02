import { testWithExamples } from "../_testutil.ts";
import { isSyncFunction } from "./sync_function.ts";

Deno.test("isSyncFunction", async (t) => {
  await testWithExamples(t, isSyncFunction, {
    validExamples: ["syncFunction"],
  });
});
