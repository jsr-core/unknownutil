import { asOptional, asUnoptional } from "./optional.ts";
import { asReadonly, asUnreadonly } from "./readonly.ts";

export const as = {
  Optional: asOptional,
  Readonly: asReadonly,
  Unoptional: asUnoptional,
  Unreadonly: asUnreadonly,
};
