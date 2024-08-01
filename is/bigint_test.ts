import { testWithExamples } from "../_testutil.ts";
import { isBigint } from "./bigint.ts";

Deno.test("isBigint", async (t) => {
  await testWithExamples(t, isBigint, { validExamples: ["bigint"] });
});
