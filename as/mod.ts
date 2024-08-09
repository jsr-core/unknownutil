import { asOptional, asUnoptional } from "./optional.ts";
import { asReadonly, asUnreadonly } from "./readonly.ts";

/**
 * Annotation collection for object predicate properties.
 */
export const as: {
  /** Annotation test1 */
  Optional: typeof asOptional;
  Readonly: typeof asReadonly;
  Unoptional: typeof asUnoptional;
  Unreadonly: typeof asUnreadonly;
} = {
  Optional: asOptional,
  /** Annotation test2 */
  Readonly: asReadonly,
  Unoptional: asUnoptional,
  Unreadonly: asUnreadonly,
};
