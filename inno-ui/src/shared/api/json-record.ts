export type JsonRecord = Record<string, unknown>;

export function asRecord(value: unknown): JsonRecord | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }
  return value as JsonRecord;
}

export function readField(record: JsonRecord, camelName: string): unknown {
  if (Object.prototype.hasOwnProperty.call(record, camelName)) {
    return record[camelName];
  }
  const pascalName = `${camelName.charAt(0).toUpperCase()}${camelName.slice(1)}`;
  return record[pascalName];
}

export function readString(
  record: JsonRecord,
  camelName: string,
): string | null {
  const value = readField(record, camelName);
  return typeof value === 'string' ? value : null;
}

export function readNumber(value: unknown): number | null {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}

export function readBoolean(value: unknown): boolean | null {
  return typeof value === 'boolean' ? value : null;
}
