import { testWithExamples } from "../_testutil.ts";
import { isPrimitive } from "./primitive.ts";

Deno.test("isPrimitive", async (t) => {
  await testWithExamples(t, isPrimitive, {
    validExamples: [
      "string",
      "number",
      "bigint",
      "boolean",
      "null",
      "undefined",
      "symbol",
    ],
  });
});
