import { httpClient } from '@/shared/api/http-client';
import type { EmptySuccess } from '@/shared/api/http-client';
import { parsePagedResultDto } from '@/shared/api/dto/paged-result-dto';
import type { PagedResultDto } from '@/shared/api/dto/paged-result-dto';
import { parseAccountDto, parseDoctorDto } from '@/shared/api/dto/profiles-dto';
import type {
  AccountDto,
  DoctorDto,
  RegisterDoctorDto,
  UpdateAccountDto,
  UpdateDoctorDto,
} from '@/shared/api/dto/profiles-dto';
import {
  accountUrl,
  doctorsUrl,
  registrationProxyUrl,
} from '@/shared/config/auth';
import {
  dateInputValue,
  doctorPageSize,
  doctorRole,
  toIsoDate,
} from '../model/doctor';
import type {
  CreateDoctorValues,
  DoctorCatalogPage,
  DoctorFilter,
  DoctorSummary,
} from '../model/doctor';

const profileHttpOptions = {
  networkMessage: 'Could not reach the profiles service.',
};

export async function loadDoctors(
  filter: DoctorFilter,
  pageNumber: number,
): Promise<DoctorCatalogPage> {
  const params = new URLSearchParams({
    PageNumber: String(pageNumber),
    PageSize: String(doctorPageSize),
  });
  if (filter.officeId.trim().length > 0) {
    params.set('OfficeId', filter.officeId.trim());
  }
  if (filter.specializationId.trim().length > 0) {
    params.set('SpecializationId', filter.specializationId.trim());
  }
  if (filter.workStartDate.length > 0) {
    params.set('WorkStartDate', toIsoDate(filter.workStartDate));
  }
  const response = await httpClient.get<PagedResultDto<DoctorDto>>(
    `${doctorsUrl}?${params.toString()}`,
    {
      ...profileHttpOptions,
      fallbackMessage: 'Could not load doctors.',
      parse: parsePagedResultDto(parseDoctorDto),
    },
  );
  if (!response.ok || response.data === null) {
    throw new Error(response.message);
  }
  const items = await Promise.all(response.data.items.map(withAccount));
  return {
    items,
    totalPages: response.data.totalPages,
    pageNumber: response.data.pageNumber,
  };
}

export async function loadDoctor(doctorId: string): Promise<DoctorSummary> {
  const response = await httpClient.get<DoctorDto>(
    `${doctorsUrl}/${doctorId}`,
    {
      ...profileHttpOptions,
      fallbackMessage: 'Could not load this doctor.',
      parse: parseDoctorDto,
    },
  );
  if (!response.ok || response.data === null) {
    throw new Error(response.message);
  }
  return withAccount(response.data);
}

async function withAccount(doctor: DoctorDto): Promise<DoctorSummary> {
  const response = await httpClient.get<AccountDto>(
    `${accountUrl}/${doctor.accountId}`,
    { ...profileHttpOptions, parse: parseAccountDto },
  );
  const account = response.ok ? response.data : null;
  return toDoctorSummary(doctor, account);
}

export async function updateDoctor(
  doctor: DoctorSummary,
  updateAccount: boolean,
): Promise<void> {
  if (updateAccount) {
    const accountRequest: UpdateAccountDto = {
      id: doctor.accountId,
      phoneNumber: doctor.phoneNumber?.trim() ?? '',
      email: doctor.email?.trim() ?? '',
      role: doctor.role,
      photoId: doctor.photoId,
      firstName: doctor.firstName.trim(),
      lastName: doctor.lastName.trim(),
      middleName:
        doctor.middleName === null || doctor.middleName.trim().length === 0
          ? null
          : doctor.middleName.trim(),
    };
    const accountResponse = await httpClient.put<
      EmptySuccess,
      UpdateAccountDto
    >(accountUrl, accountRequest, {
      ...profileHttpOptions,
      fallbackMessage: 'Could not update this account.',
    });
    if (!accountResponse.ok) {
      throw new Error(accountResponse.message);
    }
  }
  const doctorRequest: UpdateDoctorDto = {
    id: doctor.id,
    birthDate: toIsoDate(dateInputValue(doctor.birthDate)),
    workStartDate: toIsoDate(dateInputValue(doctor.workStartDate)),
    officeId: doctor.officeId.trim(),
    specializationId: doctor.specializationId.trim(),
  };
  const response = await httpClient.put<EmptySuccess, UpdateDoctorDto>(
    doctorsUrl,
    doctorRequest,
    { ...profileHttpOptions, fallbackMessage: 'Could not update this doctor.' },
  );
  if (!response.ok) {
    throw new Error(response.message);
  }
}

export async function createDoctor(values: CreateDoctorValues): Promise<void> {
  const middleName = values.middleName.trim();
  const request: RegisterDoctorDto = {
    role: 'Doctor',
    email: values.email.trim(),
    password: values.password,
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    middleName: middleName.length === 0 ? null : middleName,
    phoneNumber: values.phoneNumber.trim(),
    birthDate: toIsoDate(values.birthDate),
    photoId: null,
    workStartDate: toIsoDate(values.workStartDate),
    officeId: values.officeId.trim(),
    specializationId: values.specializationId.trim(),
  };
  const response = await httpClient.post<EmptySuccess, RegisterDoctorDto>(
    registrationProxyUrl,
    request,
    { ...profileHttpOptions, fallbackMessage: 'Could not create the doctor.' },
  );
  if (!response.ok) {
    throw new Error(response.message);
  }
}

function toDoctorSummary(
  doctor: DoctorDto,
  account: AccountDto | null,
): DoctorSummary {
  const middleName = account?.middleName?.trim() ?? '';
  return {
    id: doctor.id,
    accountId: doctor.accountId,
    firstName: account?.firstName ?? '',
    lastName: account?.lastName ?? '',
    middleName: middleName.length === 0 ? null : middleName,
    birthDate: dateInputValue(doctor.birthDate),
    workStartDate: dateInputValue(doctor.workStartDate),
    officeId: doctor.officeId,
    specializationId: doctor.specializationId,
    email: account?.email ?? null,
    phoneNumber: account?.phoneNumber ?? null,
    photoId: account?.photoId ?? null,
    role: account?.role ?? doctorRole,
  };
}
