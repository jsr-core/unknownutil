import { testWithExamples } from "../_testutil.ts";
import { isRecordObject } from "./record_object.ts";

Deno.test("isRecordObject", async (t) => {
  await testWithExamples(t, isRecordObject, {
    validExamples: ["record"],
  });
});
