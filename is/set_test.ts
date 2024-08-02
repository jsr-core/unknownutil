import { testWithExamples } from "../_testutil.ts";
import { isSet } from "./set.ts";

Deno.test("isSet", async (t) => {
  await testWithExamples(t, isSet, { validExamples: ["set"] });
});
