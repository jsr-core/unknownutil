import { assertEquals } from "@std/assert";
import { globToRegExp } from "@std/path";
import { is } from "./mod.ts";

const excludes = [
  "mod.ts",
  "*_test.ts",
];

Deno.test("is", async (t) => {
  const names = await listIsFunctions();
  await t.step(
    "must have all `is*` function aliases as entries",
    () => {
      assertEquals(Object.keys(is).sort(), names);
    },
  );
});

async function listIsFunctions(): Promise<string[]> {
  const patterns = excludes.map((p) => globToRegExp(p));
  const names: string[] = [];
  for await (const entry of Deno.readDir(import.meta.dirname!)) {
    if (!entry.isFile || !entry.name.endsWith(".ts")) continue;
    if (patterns.some((p) => p.test(entry.name))) continue;
    const mod = await import(import.meta.resolve(`./${entry.name}`));
    const isFunctionNames = Object.entries(mod)
      .filter(([k, _]) => k.startsWith("is"))
      .map(([k, _]) => k.slice(2));
    names.push(...isFunctionNames);
  }
  return names.toSorted();
}
