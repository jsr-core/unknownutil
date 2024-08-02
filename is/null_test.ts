import { testWithExamples } from "../_testutil.ts";
import { isNull } from "./null.ts";

Deno.test("isNull", async (t) => {
  await testWithExamples(t, isNull, { validExamples: ["null"] });
});
