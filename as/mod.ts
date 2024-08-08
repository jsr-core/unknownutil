import { asOptional, asUnoptional } from "./optional.ts";
import { asReadonly, asUnreadonly } from "./readonly.ts";

/**
 * Annotation collection for object predicate properties.
 */
export const as = {
  /** @inheritdoc */
  Optional: asOptional,
  /** @inheritdoc */
  Readonly: asReadonly,
  /** @inheritdoc */
  Unoptional: asUnoptional,
  /** @inheritdoc */
  Unreadonly: asUnreadonly,
};
