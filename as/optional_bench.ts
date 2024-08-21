import {
  asOptional as asOptional420,
  asUnoptional as asUnoptional420,
  hasOptional as hasOptional420,
} from "jsr:@core/unknownutil@4.2.0/as/optional";
import { asOptional, asUnoptional, hasOptional } from "./optional.ts";

const repeats = Array.from({ length: 100 });

const predicate = (x: unknown): x is string => typeof x === "string";
const optional = asOptional((x: unknown): x is string => typeof x === "string");

Deno.bench({
  name: "current",
  fn() {
    repeats.forEach(() => asOptional(predicate));
  },
  group: "asOptional (predicate)",
});

Deno.bench({
  name: "current",
  fn() {
    repeats.forEach(() => asOptional(optional));
  },
  group: "asOptional (optional)",
});

Deno.bench({
  name: "current",
  fn() {
    repeats.forEach(() => asUnoptional(predicate));
  },
  group: "asUnoptional (predicate)",
});

Deno.bench({
  name: "current",
  fn() {
    repeats.forEach(() => asUnoptional(optional));
  },
  group: "asUnoptional (optional)",
});

Deno.bench({
  name: "current",
  fn() {
    repeats.forEach(() => hasOptional(predicate));
  },
  group: "hasOptional (predicate)",
});

Deno.bench({
  name: "current",
  fn() {
    repeats.forEach(() => hasOptional(optional));
  },
  group: "hasOptional (optional)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    repeats.forEach(() => asOptional420(predicate));
  },
  group: "asOptional (predicate)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    repeats.forEach(() => asOptional420(optional));
  },
  group: "asOptional (optional)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    repeats.forEach(() => asUnoptional420(predicate));
  },
  group: "asUnoptional (predicate)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    repeats.forEach(() => asUnoptional420(optional));
  },
  group: "asUnoptional (optional)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    repeats.forEach(() => hasOptional420(predicate));
  },
  group: "hasOptional (predicate)",
});

Deno.bench({
  name: "v4.2.0",
  fn() {
    repeats.forEach(() => hasOptional420(optional));
  },
  group: "hasOptional (optional)",
});
