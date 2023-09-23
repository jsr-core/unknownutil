const defaultThreshold = 20;

export type InspectOptions = {
  // The maximum number of characters of a single attribute
  threshold?: number;
};

/**
 * Inspect a value
 */
export function inspect(value: unknown, options: InspectOptions = {}): string {
  if (value === null) {
    return "null";
  } else if (Array.isArray(value)) {
    return inspectArray(value, options);
  }
  switch (typeof value) {
    case "string":
      return JSON.stringify(value);
    case "bigint":
      return `${value}n`;
    case "object":
      if (value.constructor?.name !== "Object") {
        return value.constructor?.name;
      }
      return inspectRecord(value as Record<PropertyKey, unknown>, options);
    case "function":
      return value.name || "(anonymous)";
  }
  return value?.toString() ?? "undefined";
}

function inspectArray(value: unknown[], options: InspectOptions): string {
  const { threshold = defaultThreshold } = options;
  const vs = value.map((v) => inspect(v, options));
  const s = vs.join(", ");
  if (s.length <= threshold) return `[${s}]`;
  const m = vs.join(",\n");
  return `[\n${indent(2, m)}\n]`;
}

function inspectRecord(
  value: Record<PropertyKey, unknown>,
  options: InspectOptions,
): string {
  const { threshold = defaultThreshold } = options;
  const vs = Object.entries(value).map(([k, v]) =>
    `${k}: ${inspect(v, options)}`
  );
  const s = vs.join(", ");
  if (s.length <= threshold) return `{${s}}`;
  const m = vs.join(",\n");
  return `{\n${indent(2, m)}\n}`;
}

function indent(level: number, text: string): string {
  const prefix = " ".repeat(level);
  return text.split("\n").map((line) => `${prefix}${line}`).join("\n");
}
