import { accountUrl, doctorsUrl, facilityServicesUrl } from '@/shared/config/auth';
import type { DoctorService } from '@/shared/api/facility';

export type ServiceFilter = {
  title: string;
  isActive: '' | 'true' | 'false';
  doctorId: string;
  minPrice: string;
  maxPrice: string;
};

export type ServicePage = {
  items: DoctorService[];
  totalPages: number;
};

export type NamedDoctor = {
  id: string;
  name: string;
  specializationId: string;
};

export type CreateServiceValues = {
  title: string;
  description: string;
  price: string;
  isActive: boolean;
  doctorId: string;
};

export const emptyServiceFilter: ServiceFilter = {
  title: '',
  isActive: '',
  doctorId: '',
  minPrice: '',
  maxPrice: '',
};

export const servicePageSize = 9;

type ProblemBody = {
  detail?: string;
  title?: string;
  errors?: Record<string, string[]>;
};

export async function loadServices(
  filter: ServiceFilter,
  pageNumber: number,
): Promise<ServicePage> {
  const title = filter.title.trim().toLowerCase();
  const hasPrice =
    filter.minPrice.trim().length > 0 || filter.maxPrice.trim().length > 0;
  const needsLocalMatch = hasPrice || title.length > 0;
  const params = new URLSearchParams({
    PageNumber: needsLocalMatch ? '0' : String(pageNumber),
    PageSize: needsLocalMatch ? '100' : String(servicePageSize),
  });
  if (filter.isActive.length > 0) {
    params.set('IsActive', filter.isActive);
  }
  if (filter.doctorId.length > 0) {
    params.set('DoctorId', filter.doctorId);
  }
  if (filter.minPrice.trim().length > 0) {
    params.set('MinPrice', filter.minPrice.trim());
  }
  if (filter.maxPrice.trim().length > 0) {
    params.set('MaxPrice', filter.maxPrice.trim());
  }
  const response = await request(`${facilityServicesUrl}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(await readProblem(response, 'Could not load services.'));
  }
  const page = readPage(await response.json());
  if (!needsLocalMatch) {
    return page;
  }
  const minPrice = Number(filter.minPrice);
  const maxPrice = Number(filter.maxPrice);
  const matched = page.items.filter((item) => {
    if (title.length > 0 && !item.title.toLowerCase().includes(title)) {
      return false;
    }
    if (filter.minPrice.trim().length > 0 && item.price < minPrice) {
      return false;
    }
    if (filter.maxPrice.trim().length > 0 && item.price > maxPrice) {
      return false;
    }
    return true;
  });
  const start = pageNumber * servicePageSize;
  return {
    items: matched.slice(start, start + servicePageSize),
    totalPages: Math.ceil(matched.length / servicePageSize),
  };
}

export async function loadServicesByTitle(title: string): Promise<DoctorService[]> {
  const params = new URLSearchParams({
    PageNumber: '0',
    PageSize: '100',
    Title: title.trim(),
  });
  const response = await request(`${facilityServicesUrl}?${params.toString()}`);
  if (!response.ok) {
    return [];
  }
  const page = readPage(await response.json());
  return page.items.filter(
    (item) => item.title.trim().toLowerCase() === title.trim().toLowerCase(),
  );
}

export async function loadService(serviceId: string): Promise<DoctorService> {
  const response = await request(`${facilityServicesUrl}/${serviceId}`);
  if (!response.ok) {
    throw new Error(await readProblem(response, 'Could not load this service.'));
  }
  const service = readService(await response.json());
  if (service === null) {
    throw new Error('Could not read this service.');
  }
  return service;
}

export async function loadNamedDoctors(): Promise<NamedDoctor[]> {
  const params = new URLSearchParams({ PageNumber: '0', PageSize: '100' });
  const response = await request(`${doctorsUrl}?${params.toString()}`);
  if (!response.ok) {
    return [];
  }
  const page = readPageRecord(await response.json());
  const items = Array.isArray(page?.items ?? page?.Items)
    ? ((page?.items ?? page?.Items) as unknown[])
    : [];
  const doctors = await Promise.all(items.map(readNamedDoctor));
  return doctors.filter((doctor): doctor is NamedDoctor => doctor !== null);
}

export async function createService(values: CreateServiceValues): Promise<void> {
  const response = await request(facilityServicesUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: values.title.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      isActive: values.isActive,
      doctorId: values.doctorId,
    }),
  });
  if (!response.ok) {
    throw new Error(await readProblem(response, 'Could not create the service.'));
  }
}

async function readNamedDoctor(value: unknown): Promise<NamedDoctor | null> {
  const record = asRecord(value);
  const id = record === null ? null : readString(record, 'id', 'Id');
  const accountId =
    record === null ? null : readString(record, 'accountId', 'AccountId');
  const specializationId =
    record === null ? '' : (readString(record, 'specializationId', 'SpecializationId') ?? '');
  if (id === null || accountId === null) {
    return null;
  }
  const accountResponse = await request(`${accountUrl}/${accountId}`);
  if (!accountResponse.ok) {
    return { id, name: 'Doctor', specializationId };
  }
  const account = asRecord(await accountResponse.json());
  if (account === null) {
    return { id, name: 'Doctor', specializationId };
  }
  const firstName = readString(account, 'firstName', 'FirstName') ?? '';
  const middleName = readString(account, 'middleName', 'MiddleName') ?? '';
  const lastName = readString(account, 'lastName', 'LastName') ?? '';
  const name = [firstName, middleName, lastName]
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .join(' ');
  return { id, name: name.length > 0 ? name : 'Doctor', specializationId };
}

async function request(url: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, {
      ...init,
      credentials: 'include',
      headers: { Accept: 'application/json', ...init?.headers },
    });
  } catch {
    throw new Error('Could not reach the service.');
  }
}

async function readProblem(response: Response, fallback: string): Promise<string> {
  try {
    const body = (await response.json()) as ProblemBody;
    if (typeof body.detail === 'string' && body.detail.length > 0) {
      return body.detail;
    }
    const firstError = body.errors
      ? Object.values(body.errors)
          .flat()
          .find((message) => message.length > 0)
      : undefined;
    if (firstError) {
      return firstError;
    }
    if (typeof body.title === 'string' && body.title.length > 0) {
      return body.title;
    }
  } catch {
    return fallback;
  }
  return fallback;
}

function readPage(value: unknown): ServicePage {
  const record = readPageRecord(value);
  const itemsValue = record?.items ?? record?.Items;
  const items = Array.isArray(itemsValue)
    ? itemsValue
        .map((item) => readService(item))
        .filter((item): item is DoctorService => item !== null)
    : [];
  const totalPages = readNumber(record?.totalPages ?? record?.TotalPages) ?? 0;
  return { items, totalPages };
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
  const doctorId = readString(record, 'doctorId', 'DoctorId') ?? '';
  if (id === null || title === null || price === null || typeof isActive !== 'boolean') {
    return null;
  }
  return { id, title, description, price, isActive, doctorId };
}

function readPageRecord(value: unknown): Record<string, unknown> | null {
  return asRecord(value);
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
