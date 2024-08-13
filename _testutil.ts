import { assertEquals } from "@std/assert";
import type { IsExact } from "@std/testing/types";
import type { Predicate } from "./type.ts";

const examples = {
  string: ["", "Hello world"],
  number: [0, 1234567890],
  bigint: [0n, 1234567890n],
  boolean: [true, false],
  array: [[], [0, 1, 2], ["a", "b", "c"], [0, "a", true]],
  set: [new Set(), new Set([0, 1, 2]), new Set(["a", "b", "c"])],
  record: [{}, { a: 0, b: 1, c: 2 }, { a: "a", b: "b", c: "c" }],
  map: [
    new Map(),
    new Map([["a", 0], ["b", 1], ["c", 2]]),
    new Map([["a", "a"], ["b", "b"], ["c", "c"]]),
  ],
  syncFunction: [function a() {}, () => {}],
  asyncFunction: [async function b() {}, async () => {}],
  null: [null],
  undefined: [undefined],
  symbol: [Symbol("a"), Symbol("b"), Symbol("c")],
  date: [new Date(1690248225000), new Date(0)],
  promise: [new Promise(() => {})],
} as const;

export async function testWithExamples<T>(
  t: Deno.TestContext,
  pred: Predicate<T>,
  opts?: {
    validExamples?: (keyof typeof examples)[];
    excludeExamples?: (keyof typeof examples)[];
  },
): Promise<void> {
  const { validExamples = [], excludeExamples = [] } = opts ?? {};
  const exampleEntries = (Object.entries(examples) as unknown as [
    name: keyof typeof examples,
    example: unknown[],
  ][]).filter(([k]) => !excludeExamples.includes(k));
  for (const [name, example] of exampleEntries) {
    const expect = validExamples.includes(name);
    for (const v of example) {
      await t.step(
        `returns ${expect} on ${stringify(v)}`,
        () => {
          assertEquals(pred(v), expect);
        },
      );
    }
  }
}

// It seems 'IsExact' in deno_std is false positive so use `Equal` in type-challenges
// https://github.com/type-challenges/type-challenges/blob/e77262dba62e9254451f661cb4fe5517ffd1d933/utils/index.d.ts#L7-L9
/** @deprecated use {@linkcode Equal} */
export type TypeChallengesEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false;

// `Equal` in type-challenges is false positive so combine `IsExact` + `Equal`.
export type Equal<X, Y> = TypeChallengesEqual<X, Y> extends true ? IsExact<X, Y>
  : false;

export function stringify(x: unknown): string {
  if (x instanceof Date) return `Date(${x.valueOf()})`;
  if (x instanceof Promise) return "Promise";
  if (x instanceof Set) return `Set(${stringify([...x.values()])})`;
  if (x instanceof Map) return `Map(${stringify([...x.entries()])})`;
  if (typeof x === "function") return x.toString();
  if (typeof x === "bigint") return `${x}n`;
  if (typeof x === "symbol") return x.toString();
  return JSON.stringify(x);
}
