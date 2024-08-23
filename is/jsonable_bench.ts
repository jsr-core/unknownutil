import { assert } from "@std/assert";
import { isJsonable } from "./jsonable.ts";
import { buildTestcases } from "./custom_jsonable_test.ts";

const repeats = Array.from({ length: 100 });

for (const [name, value] of buildTestcases()) {
  switch (name) {
    case "undefined":
    case "bigint":
    case "function":
    case "symbol":
      Deno.bench({
        name: "current",
        fn() {
          assert(repeats.every(() => !isJsonable(value)));
        },
        group: `isJsonable (${name})`,
      });
      break;
    default:
      Deno.bench({
        name: "current",
        fn() {
          assert(repeats.every(() => isJsonable(value)));
        },
        group: `isJsonable (${name})`,
      });
  }
}

for (const [name, value] of buildTestcases()) {
  switch (name) {
    case "undefined":
    case "null":
      continue;
    case "bigint":
    case "function":
      Deno.bench({
        name: "current",
        fn() {
          const v = Object.assign(value as NonNullable<unknown>, {
            toJSON: () => "custom",
          });
          assert(repeats.every(() => isJsonable(v)));
        },
        group: `isJsonable (${name} with own toJSON method)`,
      });
  }
}

for (const [name, value] of buildTestcases()) {
  switch (name) {
    case "bigint":
    case "function":
      Deno.bench({
        name: "current",
        fn() {
          const proto = Object.getPrototypeOf(value);
          proto.toJSON = () => "custom";
          try {
            assert(repeats.every(() => isJsonable(value)));
          } finally {
            delete proto.toJSON;
          }
        },
        group:
          `isJsonable (${name} with class prototype defines toJSON method)`,
      });
  }
}
