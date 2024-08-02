import { testWithExamples } from "../_testutil.ts";
import { isNullish } from "./nullish.ts";

Deno.test("isNullish", async (t) => {
  await testWithExamples(t, isNullish, {
    validExamples: ["null", "undefined"],
  });
});
