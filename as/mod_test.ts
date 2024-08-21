import { assertEquals } from "@std/assert";
import { globToRegExp } from "@std/path";
import { as } from "./mod.ts";

const excludes = [
  "mod.ts",
  "_*.ts",
  "*_bench.ts",
  "*_test.ts",
];

Deno.test("as", async (t) => {
  // List all files under the directory
  const names = await listAsFunctions();
  await t.step(
    "must have all `as*` function aliases as entries",
    () => {
      assertEquals(Object.keys(as).sort(), names);
    },
  );
});

async function listAsFunctions(): Promise<string[]> {
  const patterns = excludes.map((p) => globToRegExp(p));
  const names: string[] = [];
  for await (const entry of Deno.readDir(import.meta.dirname!)) {
    if (!entry.isFile || !entry.name.endsWith(".ts")) continue;
    if (patterns.some((p) => p.test(entry.name))) continue;
    const mod = await import(import.meta.resolve(`./${entry.name}`));
    const isFunctionNames = Object.entries(mod)
      .filter(([k, _]) => k.startsWith("as"))
      .map(([k, _]) => k.slice(2));
    names.push(...isFunctionNames);
  }
  return names.toSorted();
}
