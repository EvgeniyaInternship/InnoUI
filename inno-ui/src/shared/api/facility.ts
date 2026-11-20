import { httpClient } from '@/shared/api/http-client';
import {
  parseOfficeDto,
  parseServiceDto,
  parseSpecializationDto,
} from '@/shared/api/dto/facility-dto';
import type { ServiceDto } from '@/shared/api/dto/facility-dto';
import { parsePagedResultDto } from '@/shared/api/dto/paged-result-dto';
import type { PagedResultDto } from '@/shared/api/dto/paged-result-dto';
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
  const page = await loadPage(
    facilityOfficesUrl,
    parsePagedResultDto(parseOfficeDto),
  );
  return page.items.map((office) => ({
    id: office.id,
    title: office.title,
    description: null,
  }));
}

export async function loadSpecializations(): Promise<FacilityRecord[]> {
  const page = await loadPage(
    facilitySpecializationsUrl,
    parsePagedResultDto(parseSpecializationDto),
  );
  return page.items.map((specialization) => ({
    id: specialization.id,
    title: specialization.title,
    description: specialization.description,
  }));
}

export async function loadDoctorServices(
  doctorId: string,
): Promise<DoctorService[]> {
  const params = new URLSearchParams({
    DoctorId: doctorId,
    PageNumber: '0',
    PageSize: String(catalogPageSize),
  });
  const response = await httpClient.get<PagedResultDto<ServiceDto>>(
    `${facilityServicesUrl}?${params.toString()}`,
    { parse: parsePagedResultDto(parseServiceDto) },
  );
  if (!response.ok || response.data === null) {
    return [];
  }
  return response.data.items.map(toDoctorService);
}

export function recordTitle(records: FacilityRecord[], id: string): string {
  return records.find((record) => record.id === id)?.title ?? id;
}

async function loadPage<T>(
  url: string,
  parse: (value: unknown) => PagedResultDto<T> | null,
): Promise<PagedResultDto<T>> {
  const params = new URLSearchParams({
    PageNumber: '0',
    PageSize: String(catalogPageSize),
  });
  const response = await httpClient.get<PagedResultDto<T>>(
    `${url}?${params.toString()}`,
    { parse },
  );
  if (!response.ok || response.data === null) {
    return {
      items: [],
      totalCount: 0,
      totalPages: 0,
      pageNumber: 0,
      pageSize: 0,
    };
  }
  return response.data;
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
