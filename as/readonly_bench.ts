import {
  asReadonly as asReadonly420,
  asUnreadonly as asUnreadonly420,
  hasReadonly as hasReadonly420,
} from "jsr:@core/unknownutil@4.2.0/as/readonly";
import { asReadonly, asUnreadonly, hasReadonly } from "./readonly.ts";

const repeats = Array.from({ length: 100 });

const predicate = (x: unknown): x is string => typeof x === "string";
const readonly = asReadonly((x: unknown): x is string => typeof x === "string");

Deno.bench({
  name: "current",
  fn() {
    repeats.forEach(() => asReadonly(predicate));
  },
  group: "asReadonly (predicate)",
});

Deno.bench({
  name: "current",
  fn() {
    repeats.forEach(() => asReadonly(readonly));
  },
  group: "asReadonly (readonly)",
});

Deno.bench({
  name: "current",
  fn() {
    repeats.forEach(() => asUnreadonly(predicate));
  },
  group: "asUnreadonly (predicate)",
});

Deno.bench({
  name: "current",
  fn() {
    repeats.forEach(() => asUnreadonly(readonly));
  },
  group: "asUnreadonly (readonly)",
});

Deno.bench({
  name: "current",
  fn() {
    repeats.forEach(() => hasReadonly(predicate));
  },
  group: "hasReadonly (predicate)",
});

Deno.bench({
  name: "current",
  fn() {
    repeats.forEach(() => hasReadonly(readonly));
  },
  group: "hasReadonly (readonly)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    repeats.forEach(() => asReadonly420(predicate));
  },
  group: "asReadonly (predicate)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    repeats.forEach(() => asReadonly420(readonly));
  },
  group: "asReadonly (readonly)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    repeats.forEach(() => asUnreadonly420(predicate));
  },
  group: "asUnreadonly (predicate)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    repeats.forEach(() => asUnreadonly420(readonly));
  },
  group: "asUnreadonly (readonly)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    repeats.forEach(() => hasReadonly420(predicate));
  },
  group: "hasReadonly (predicate)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    repeats.forEach(() => hasReadonly420(readonly));
  },
  group: "hasReadonly (readonly)",
});
