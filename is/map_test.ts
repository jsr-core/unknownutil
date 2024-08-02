import { testWithExamples } from "../_testutil.ts";
import { isMap } from "./map.ts";

Deno.test("isMap", async (t) => {
  await testWithExamples(t, isMap, {
    validExamples: ["map"],
  });
});
