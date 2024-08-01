import { testWithExamples } from "../_testutil.ts";
import { isUnknown } from "./unknown.ts";

Deno.test("isUnknown", async (t) => {
  await testWithExamples(t, isUnknown, {
    validExamples: [
      "string",
      "number",
      "bigint",
      "boolean",
      "array",
      "set",
      "record",
      "map",
      "syncFunction",
      "asyncFunction",
      "null",
      "undefined",
      "symbol",
      "date",
      "promise",
    ],
  });
});
