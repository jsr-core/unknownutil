// It seems 'IsExact' in deno_std is false positive so use `Equal` in type-challenges
// https://github.com/type-challenges/type-challenges/blob/e77262dba62e9254451f661cb4fe5517ffd1d933/utils/index.d.ts#L7-L9
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false;

export function stringify(x: unknown): string {
  if (x instanceof Date) return `Date(${x.valueOf()})`;
  if (x instanceof Promise) return "Promise";
  if (typeof x === "function") return x.toString();
  if (typeof x === "bigint") return `${x}n`;
  if (typeof x === "symbol") return x.toString();
  return JSON.stringify(x);
}
