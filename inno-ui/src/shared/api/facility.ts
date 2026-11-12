import {
  facilityOfficesUrl,
  facilityServicesUrl,
  facilitySpecializationsUrl,
} from '@/shared/config/auth';

export type FacilityRecord = {
  id: string;
  title: string;
  description: string | null;
};

export type DoctorService = {
  id: string;
  title: string;
  description: string;
  price: number;
  isActive: boolean;
  doctorId: string;
};

const catalogPageSize = 100;

export async function loadOffices(): Promise<FacilityRecord[]> {
  return loadCatalog(facilityOfficesUrl);
}

export async function loadSpecializations(): Promise<FacilityRecord[]> {
  return loadCatalog(facilitySpecializationsUrl);
}

export async function loadDoctorServices(
  doctorId: string,
): Promise<DoctorService[]> {
  const params = new URLSearchParams({
    DoctorId: doctorId,
    PageNumber: '0',
    PageSize: String(catalogPageSize),
  });
  const response = await request(`${facilityServicesUrl}?${params.toString()}`);
  if (!response.ok) {
    return [];
  }
  const items = readItems(await response.json());
  return items
    .map((item) => readService(item))
    .filter((item): item is DoctorService => item !== null);
}

export function recordTitle(
  records: FacilityRecord[],
  id: string,
): string {
  return records.find((record) => record.id === id)?.title ?? id;
}

async function loadCatalog(url: string): Promise<FacilityRecord[]> {
  const params = new URLSearchParams({
    PageNumber: '0',
    PageSize: String(catalogPageSize),
  });
  const response = await request(`${url}?${params.toString()}`);
  if (!response.ok) {
    return [];
  }
  return readItems(await response.json())
    .map((item) => readRecord(item))
    .filter((item): item is FacilityRecord => item !== null);
}

async function request(url: string): Promise<Response> {
  try {
    return await fetch(url, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
  } catch {
    return new Response(null, { status: 503 });
  }
}

function readItems(value: unknown): unknown[] {
  if (typeof value !== 'object' || value === null) {
    return [];
  }
  const record = value as Record<string, unknown>;
  const items = record.items ?? record.Items;
  return Array.isArray(items) ? items : [];
}

function readRecord(value: unknown): FacilityRecord | null {
  const record = asRecord(value);
  if (record === null) {
    return null;
  }
  const id = readString(record, 'id', 'Id');
  const title = readString(record, 'title', 'Title');
  if (id === null || title === null) {
    return null;
  }
  return {
    id,
    title,
    description: readString(record, 'description', 'Description'),
  };
}

function readService(value: unknown): DoctorService | null {
  const record = asRecord(value);
  if (record === null) {
    return null;
  }
  const id = readString(record, 'id', 'Id');
  const title = readString(record, 'title', 'Title');
  const description = readString(record, 'description', 'Description') ?? '';
  const price = readNumber(record.price ?? record.Price);
  const isActive = record.isActive ?? record.IsActive;
  if (id === null || title === null || price === null || typeof isActive !== 'boolean') {
    return null;
  }
  const doctorId = readString(record, 'doctorId', 'DoctorId') ?? '';
  return { id, title, description, price, isActive, doctorId };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  return value as Record<string, unknown>;
}

function readString(
  record: Record<string, unknown>,
  camelName: string,
  pascalName: string,
): string | null {
  const value = record[camelName] ?? record[pascalName];
  return typeof value === 'string' ? value : null;
}

function readNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}
