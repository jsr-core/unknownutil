import { testWithExamples } from "../_testutil.ts";
import { isRecord } from "./record.ts";

Deno.test("isRecord", async (t) => {
  await testWithExamples(t, isRecord, {
    validExamples: ["record", "date", "promise", "set", "map"],
  });
});
