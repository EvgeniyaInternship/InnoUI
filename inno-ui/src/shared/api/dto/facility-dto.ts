import {
  asRecord,
  readBoolean,
  readField,
  readNumber,
  readString,
} from '@/shared/api/json-record';

export type OfficeDto = {
  readonly id: string;
  readonly title: string;
};

export type SpecializationDto = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
};

export type ServiceDto = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly price: number;
  readonly isActive: boolean;
  readonly doctorId: string;
};

export type CreateServiceDto = {
  readonly title: string;
  readonly description: string;
  readonly price: number;
  readonly isActive: boolean;
  readonly doctorId: string;
};

export function parseOfficeDto(value: unknown): OfficeDto | null {
  const record = asRecord(value);
  if (record === null) {
    return null;
  }
  const id = readString(record, 'id');
  const title = readString(record, 'title');
  if (id === null || title === null) {
    return null;
  }
  return { id, title };
}

export function parseSpecializationDto(
  value: unknown,
): SpecializationDto | null {
  const record = asRecord(value);
  if (record === null) {
    return null;
  }
  const id = readString(record, 'id');
  const title = readString(record, 'title');
  const description = readString(record, 'description');
  if (id === null || title === null || description === null) {
    return null;
  }
  return { id, title, description };
}

export function parseServiceDto(value: unknown): ServiceDto | null {
  const record = asRecord(value);
  if (record === null) {
    return null;
  }
  const id = readString(record, 'id');
  const title = readString(record, 'title');
  const description = readString(record, 'description') ?? '';
  const price = readNumber(readField(record, 'price'));
  const isActive = readBoolean(readField(record, 'isActive'));
  const doctorId = readString(record, 'doctorId') ?? '';
  if (id === null || title === null || price === null || isActive === null) {
    return null;
  }
  return { id, title, description, price, isActive, doctorId };
}
