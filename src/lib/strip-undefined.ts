/** Removes keys whose value is `undefined` (required under exactOptionalPropertyTypes). */
export function stripUndefined<T extends Record<string, unknown>>(
  input: T,
): { [K in keyof T]-?: Exclude<T[K], undefined> } {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) out[key] = value;
  }
  return out as { [K in keyof T]-?: Exclude<T[K], undefined> };
}
