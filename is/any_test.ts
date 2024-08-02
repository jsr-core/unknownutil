import { testWithExamples } from "../_testutil.ts";
import { isAny } from "./any.ts";

Deno.test("isAny", async (t) => {
  await testWithExamples(t, isAny, {
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
