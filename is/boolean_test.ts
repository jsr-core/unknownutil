import { testWithExamples } from "../_testutil.ts";
import { isBoolean } from "./boolean.ts";

Deno.test("isBoolean", async (t) => {
  await testWithExamples(t, isBoolean, { validExamples: ["boolean"] });
});
