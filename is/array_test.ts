import { testWithExamples } from "../_testutil.ts";
import { isArray } from "./array.ts";

Deno.test("isArray", async (t) => {
  await testWithExamples(t, isArray, { validExamples: ["array"] });
});
