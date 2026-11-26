import { asRecord, readField, readNumber } from '@/shared/api/json-record';

export type PagedResultDto<T> = {
  readonly items: readonly T[];
  readonly totalCount: number;
  readonly totalPages: number;
  readonly pageNumber: number;
  readonly pageSize: number;
};

export function parsePagedResultDto<T>(
  parseItem: (value: unknown) => T | null,
): (value: unknown) => PagedResultDto<T> | null {
  return (value) => {
    const record = asRecord(value);
    if (record === null) {
      return null;
    }
    const itemsValue = readField(record, 'items');
    const items = Array.isArray(itemsValue)
      ? itemsValue.flatMap((item) => {
          const parsed = parseItem(item);
          return parsed === null ? [] : [parsed];
        })
      : [];
    return {
      items,
      totalCount: readNumber(readField(record, 'totalCount')) ?? items.length,
      totalPages: readNumber(readField(record, 'totalPages')) ?? 0,
      pageNumber: readNumber(readField(record, 'pageNumber')) ?? 0,
      pageSize: readNumber(readField(record, 'pageSize')) ?? items.length,
    };
  };
}
