import { testWithExamples } from "../_testutil.ts";
import { isSymbol } from "./symbol.ts";

Deno.test("isSymbol", async (t) => {
  await testWithExamples(t, isSymbol, { validExamples: ["symbol"] });
});
