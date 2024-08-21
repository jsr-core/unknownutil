import { assertArrayIncludes } from "@std/assert";
import { basename, globToRegExp } from "@std/path";
import { parse } from "@std/jsonc";
import { ensure } from "./ensure.ts";
import { is } from "./is/mod.ts";

const excludes = [
  "mod.ts",
  "_*.ts",
  "*_bench.ts",
  "*_test.ts",
];

Deno.test("JSR exports must have all `as` modules", async () => {
  const moduleNames = await listModuleNames(
    new URL(import.meta.resolve("./as")),
  );
  const jsrExports = await loadJsrExports();
  assertArrayIncludes(Object.entries(jsrExports.exports), [
    ["./as", "./as/mod.ts"],
    ...moduleNames.map((
      v,
    ) => [`./as/${v.replaceAll("_", "-")}`, `./as/${v}.ts`]),
  ]);
});

Deno.test("JSR exports must have all `is` modules", async () => {
  const moduleNames = await listModuleNames(
    new URL(import.meta.resolve("./is")),
  );
  const jsrExports = await loadJsrExports();
  assertArrayIncludes(Object.entries(jsrExports.exports), [
    ["./is", "./is/mod.ts"],
    ...moduleNames.map((
      v,
    ) => [`./is/${v.replaceAll("_", "-")}`, `./is/${v}.ts`]),
  ]);
});

async function listModuleNames(path: URL | string): Promise<string[]> {
  const patterns = excludes.map((p) => globToRegExp(p));
  const names: string[] = [];
  for await (const entry of Deno.readDir(path)) {
    if (!entry.isFile || !entry.name.endsWith(".ts")) continue;
    if (patterns.some((p) => p.test(entry.name))) continue;
    names.push(basename(entry.name, ".ts"));
  }
  return names;
}

async function loadJsrExports(): Promise<{ exports: Record<string, string> }> {
  const text = await Deno.readTextFile(
    new URL(import.meta.resolve("./deno.jsonc")),
  );
  const json = ensure(
    parse(text),
    is.ObjectOf({
      exports: is.RecordOf(is.String, is.String),
    }),
  );
  return { exports: json.exports };
}
