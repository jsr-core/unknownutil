import { testWithExamples } from "../_testutil.ts";
import { isNumber } from "./number.ts";

Deno.test("isNumber", async (t) => {
  await testWithExamples(t, isNumber, { validExamples: ["number"] });
});
