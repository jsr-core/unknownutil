import { inspect } from "./_inspect.ts";

/**
 * Rewrite the function name.
 */
// deno-lint-ignore no-explicit-any
export function rewriteName<F extends (...args: any[]) => unknown>(
  fn: F,
  name: string,
  ...args: unknown[]
): F {
  let cachedName: string | undefined;
  return Object.defineProperties(fn, {
    name: {
      get: () => {
        if (cachedName) return cachedName;
        cachedName = `${name}(${args.map((v) => inspect(v)).join(", ")})`;
        return cachedName;
      },
    },
  });
}
