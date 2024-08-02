import { asOptional, asUnoptional } from "./optional.ts";
import { asReadonly, asUnreadonly } from "./readonly.ts";

/**
 * Annotation collection for object predicate properties.
 */
export const as = {
  Optional: asOptional,
  Readonly: asReadonly,
  Unoptional: asUnoptional,
  Unreadonly: asUnreadonly,
};
