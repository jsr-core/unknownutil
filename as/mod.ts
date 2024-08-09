import { asOptional, asUnoptional } from "./optional.ts";
import { asReadonly, asUnreadonly } from "./readonly.ts";

export type AsCollection = {
  /** Annotation test1 */
  Optional: typeof asOptional;
  Readonly: typeof asReadonly;
  Unoptional: typeof asUnoptional;
  Unreadonly: typeof asUnreadonly;
};

/**
 * Annotation collection for object predicate properties.
 */
export const as: AsCollection = {
  Optional: asOptional,
  /** Annotation test2 */
  Readonly: asReadonly,
  Unoptional: asUnoptional,
  Unreadonly: asUnreadonly,
};
