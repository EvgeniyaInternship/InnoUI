import { httpClient } from '@/shared/api/http-client';
import type { EmptySuccess } from '@/shared/api/http-client';
import type { DoctorService } from '@/shared/api/facility';
import type {
  CreateServiceDto,
  ServiceDto,
} from '@/shared/api/dto/facility-dto';
import { parseServiceDto } from '@/shared/api/dto/facility-dto';
import { parsePagedResultDto } from '@/shared/api/dto/paged-result-dto';
import type { PagedResultDto } from '@/shared/api/dto/paged-result-dto';
import type { AccountDto, DoctorDto } from '@/shared/api/dto/profiles-dto';
import { parseAccountDto, parseDoctorDto } from '@/shared/api/dto/profiles-dto';
import {
  accountUrl,
  doctorsUrl,
  facilityServicesUrl,
} from '@/shared/config/auth';

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

const serviceHttpOptions = {
  networkMessage: 'Could not reach the service.',
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
  const page = await loadServicePage(
    `${facilityServicesUrl}?${params.toString()}`,
    'Could not load services.',
  );
  if (!needsLocalMatch) {
    return {
      items: page.items.map(toDoctorService),
      totalPages: page.totalPages,
    };
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
    items: matched.slice(start, start + servicePageSize).map(toDoctorService),
    totalPages: Math.ceil(matched.length / servicePageSize),
  };
}

export async function loadServicesByTitle(
  title: string,
): Promise<DoctorService[]> {
  const params = new URLSearchParams({
    PageNumber: '0',
    PageSize: '100',
    Title: title.trim(),
  });
  const response = await httpClient.get<PagedResultDto<ServiceDto>>(
    `${facilityServicesUrl}?${params.toString()}`,
    { ...serviceHttpOptions, parse: parsePagedResultDto(parseServiceDto) },
  );
  if (!response.ok || response.data === null) {
    return [];
  }
  return response.data.items
    .filter(
      (item) => item.title.trim().toLowerCase() === title.trim().toLowerCase(),
    )
    .map(toDoctorService);
}

export async function loadService(serviceId: string): Promise<DoctorService> {
  const response = await httpClient.get<ServiceDto>(
    `${facilityServicesUrl}/${serviceId}`,
    {
      ...serviceHttpOptions,
      fallbackMessage: 'Could not load this service.',
      parse: parseServiceDto,
    },
  );
  if (!response.ok || response.data === null) {
    throw new Error(response.message);
  }
  return toDoctorService(response.data);
}

export async function loadNamedDoctors(): Promise<NamedDoctor[]> {
  const params = new URLSearchParams({ PageNumber: '0', PageSize: '100' });
  const response = await httpClient.get<PagedResultDto<DoctorDto>>(
    `${doctorsUrl}?${params.toString()}`,
    { ...serviceHttpOptions, parse: parsePagedResultDto(parseDoctorDto) },
  );
  if (!response.ok || response.data === null) {
    return [];
  }
  return Promise.all(response.data.items.map(readNamedDoctor));
}

export async function createService(
  values: CreateServiceValues,
): Promise<void> {
  const request: CreateServiceDto = {
    title: values.title.trim(),
    description: values.description.trim(),
    price: Number(values.price),
    isActive: values.isActive,
    doctorId: values.doctorId,
  };
  const response = await httpClient.post<EmptySuccess, CreateServiceDto>(
    facilityServicesUrl,
    request,
    { ...serviceHttpOptions, fallbackMessage: 'Could not create the service.' },
  );
  if (!response.ok) {
    throw new Error(response.message);
  }
}

async function loadServicePage(
  url: string,
  fallbackMessage: string,
): Promise<PagedResultDto<ServiceDto>> {
  const response = await httpClient.get<PagedResultDto<ServiceDto>>(url, {
    ...serviceHttpOptions,
    fallbackMessage,
    parse: parsePagedResultDto(parseServiceDto),
  });
  if (!response.ok || response.data === null) {
    throw new Error(response.message);
  }
  return response.data;
}

async function readNamedDoctor(doctor: DoctorDto): Promise<NamedDoctor> {
  const accountResponse = await httpClient.get<AccountDto>(
    `${accountUrl}/${doctor.accountId}`,
    { ...serviceHttpOptions, parse: parseAccountDto },
  );
  const account =
    accountResponse.ok && accountResponse.data !== null
      ? accountResponse.data
      : null;
  return {
    id: doctor.id,
    name: account === null ? 'Doctor' : displayName(account),
    specializationId: doctor.specializationId,
  };
}

function displayName(account: AccountDto): string {
  const name = [account.firstName, account.middleName ?? '', account.lastName]
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .join(' ');
  return name.length > 0 ? name : 'Doctor';
}

function toDoctorService(service: ServiceDto): DoctorService {
  return {
    id: service.id,
    title: service.title,
    description: service.description,
    price: service.price,
    isActive: service.isActive,
    doctorId: service.doctorId,
  };
}
