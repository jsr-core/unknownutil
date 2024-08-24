import { assertEquals } from "@std/assert";
import { isCustomJsonable } from "./custom_jsonable.ts";

export function buildTestcases() {
  return [
    ["undefined", undefined],
    ["null", null],
    ["string", ""],
    ["number", 0],
    ["boolean", true],
    ["array", []],
    ["object", {}],
    ["bigint", 0n],
    ["function", () => {}],
    ["symbol", Symbol()],
  ] as const satisfies readonly (readonly [name: string, value: unknown])[];
}

Deno.test("isCustomJsonable", async (t) => {
  for (const [name, value] of buildTestcases()) {
    await t.step(`return false for ${name}`, () => {
      assertEquals(isCustomJsonable(value), false);
    });
  }

  for (const [name, value] of buildTestcases()) {
    switch (name) {
      case "undefined":
      case "null":
        // Skip undefined, null that is not supported by Object.assign.
        continue;
      default:
        // Object.assign() doesn't make a value CustomJsonable.
        await t.step(
          `return false for ${name} even if it is wrapped by Object.assign()`,
          () => {
            assertEquals(
              isCustomJsonable(
                Object.assign(value as NonNullable<unknown>, { a: 0 }),
              ),
              false,
            );
          },
        );
    }
  }

  for (const [name, value] of buildTestcases()) {
    switch (name) {
      case "undefined":
      case "null":
        // Skip undefined, null that is not supported by Object.assign.
        continue;
      default:
        // toJSON method applied with Object.assign() makes a value CustomJsonable.
        await t.step(
          `return true for ${name} if it has own toJSON method`,
          () => {
            assertEquals(
              isCustomJsonable(
                Object.assign(value as NonNullable<unknown>, {
                  toJSON: () => "custom",
                }),
              ),
              true,
            );
          },
        );
    }
  }

  for (const [name, value] of buildTestcases()) {
    switch (name) {
      case "undefined":
      case "null":
        // Skip undefined, null that does not have constructor.
        continue;
      case "string":
      case "number":
      case "boolean":
      case "symbol":
        // toJSON method defined in the class prototype does NOT make a value CustomJsonable if the value is
        // string, number, boolean, or symbol.
        // See https://tc39.es/ecma262/multipage/structured-data.html#sec-serializejsonproperty for details.
        await t.step(
          `return false for ${name} if the class prototype defines toJSON method`,
          () => {
            const proto = Object.getPrototypeOf(value);
            proto.toJSON = () => "custom";
            try {
              assertEquals(isCustomJsonable(value), false);
            } finally {
              delete proto.toJSON;
            }
          },
        );
        break;
      default:
        // toJSON method defined in the class prototype makes a value CustomJsonable.
        await t.step(
          `return true for ${name} if the class prototype defines toJSON method`,
          () => {
            const proto = Object.getPrototypeOf(value);
            proto.toJSON = () => "custom";
            try {
              assertEquals(isCustomJsonable(value), true);
            } finally {
              delete proto.toJSON;
            }
          },
        );
    }
  }
});
