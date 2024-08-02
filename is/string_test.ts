import { testWithExamples } from "../_testutil.ts";
import { isString } from "./string.ts";

Deno.test("isString", async (t) => {
  await testWithExamples(t, isString, { validExamples: ["string"] });
});
