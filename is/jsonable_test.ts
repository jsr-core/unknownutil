import { assertEquals } from "@std/assert";
import { isJsonable } from "./jsonable.ts";
import { buildTestcases } from "./custom_jsonable_test.ts";

Deno.test("isJsonable", async (t) => {
  for (const [name, value] of buildTestcases()) {
    switch (name) {
      case "undefined":
      case "bigint":
      case "function":
      case "symbol":
        await t.step(`return false for ${name}`, () => {
          assertEquals(isJsonable(value), false);
        });
        break;
      default:
        await t.step(`return true for ${name}`, () => {
          assertEquals(isJsonable(value), true);
        });
    }
  }

  for (const [name, value] of buildTestcases()) {
    switch (name) {
      case "undefined":
      case "null":
        // Skip undefined, null that is not supported by Object.assign.
        continue;
      case "bigint":
      case "function":
        // Object.assign() doesn't make bigint, function Jsonable.
        await t.step(
          `return false for ${name} even if it is wrapped by Object.assign()`,
          () => {
            assertEquals(
              isJsonable(
                Object.assign(value as NonNullable<unknown>, { a: 0 }),
              ),
              false,
            );
          },
        );
        break;
      default:
        // Object.assign() makes other values Jsonable.
        await t.step(
          `return true for ${name} if it is wrapped by Object.assign()`,
          () => {
            assertEquals(
              isJsonable(
                Object.assign(value as NonNullable<unknown>, { a: 0 }),
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
        // Skip undefined, null that is not supported by Object.assign.
        continue;
      case "bigint":
      case "function":
        // toJSON method assigned with Object.assign() makes bigint, function Jsonable.
      default:
        // toJSON method assigned with Object.assign() makes other values Jsonable.
        await t.step(
          `return true for ${name} if it has own toJSON method`,
          () => {
            assertEquals(
              isJsonable(
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
        // Skip undefined, null that does not have prototype
        continue;
      case "symbol":
        // toJSON method defined in the class prototype does not make symbol Jsonable.
        await t.step(
          `return false for ${name} if the class prototype defines toJSON method`,
          () => {
            const proto = Object.getPrototypeOf(value);
            proto.toJSON = () => "custom";
            try {
              assertEquals(isJsonable(value), false);
            } finally {
              delete proto.toJSON;
            }
          },
        );
        break;
      case "bigint":
      case "function":
        // toJSON method defined in the class prototype makes bigint, function Jsonable.
      default:
        // toJSON method defined in the class prototype makes other values Jsonable.
        await t.step(
          `return true for ${name} if the class prototype defines toJSON method`,
          () => {
            const proto = Object.getPrototypeOf(value);
            proto.toJSON = () => "custom";
            try {
              assertEquals(isJsonable(value), true);
            } finally {
              delete proto.toJSON;
            }
          },
        );
    }
  }

  await t.step(
    "returns true on circular reference (unwilling behavior)",
    () => {
      const circular = { a: {} };
      circular["a"] = circular;
      assertEquals(isJsonable(circular), true);
    },
  );
});
