import _deprecated from "./is/_deprecated.ts";
import annotation from "./is/annotation.ts";
import core from "./is/core.ts";
import factory from "./is/factory.ts";
import utility from "./is/utility.ts";

export * from "./is/_deprecated.ts";
export * from "./is/annotation.ts";
export * from "./is/core.ts";
export * from "./is/factory.ts";
export * from "./is/utility.ts";
export type * from "./is/type.ts";

export default {
  ..._deprecated,
  ...annotation,
  ...core,
  ...factory,
  ...utility,
};
