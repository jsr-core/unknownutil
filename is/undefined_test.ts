import { testWithExamples } from "../_testutil.ts";
import { isUndefined } from "./undefined.ts";

Deno.test("isUndefined", async (t) => {
  await testWithExamples(t, isUndefined, { validExamples: ["undefined"] });
});
