import annotation from "./is/annotation.ts";
import core from "./is/core.ts";
import factory from "./is/factory.ts";
import utility from "./is/utility.ts";

export type * from "./is/type.ts";
export * from "./is/annotation.ts";
export * from "./is/core.ts";
export * from "./is/factory.ts";
export * from "./is/utility.ts";

export default {
  ...annotation,
  ...core,
  ...factory,
  ...utility,
};
