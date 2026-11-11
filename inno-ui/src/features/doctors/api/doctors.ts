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

type ProblemBody = {
  detail?: string;
  title?: string;
  errors?: Record<string, string[]>;
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
  const response = await request(`${doctorsUrl}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(await readProblem(response, 'Could not load doctors.'));
  }
  const page = readCatalog(await response.json());
  const items = await Promise.all(page.items.map(withAccount));
  return { ...page, items };
}

export async function loadDoctor(doctorId: string): Promise<DoctorSummary> {
  const response = await request(`${doctorsUrl}/${doctorId}`);
  if (!response.ok) {
    throw new Error(await readProblem(response, 'Could not load this doctor.'));
  }
  const doctor = readDoctor(await response.json());
  if (doctor === null) {
    throw new Error('Could not read this doctor.');
  }
  return withAccount(doctor);
}

async function withAccount(doctor: DoctorSummary): Promise<DoctorSummary> {
  const response = await request(`${accountUrl}/${doctor.accountId}`);
  if (!response.ok) {
    return doctor;
  }
  const record = readRecord(await response.json());
  if (record === null) {
    return doctor;
  }
  const firstName =
    readString(record, 'firstName', 'FirstName') ?? doctor.firstName;
  const lastName =
    readString(record, 'lastName', 'LastName') ?? doctor.lastName;
  const middleName = readString(record, 'middleName', 'MiddleName');
  return {
    ...doctor,
    firstName,
    lastName,
    middleName:
      middleName === null || middleName.length === 0 ? null : middleName,
    email: readString(record, 'email', 'Email'),
    phoneNumber: readString(record, 'phoneNumber', 'PhoneNumber'),
    photoId: readString(record, 'photoId', 'PhotoId'),
    role: readNumber(record.role ?? record.Role) ?? doctorRole,
  };
}

export async function updateDoctor(
  doctor: DoctorSummary,
  updateAccount: boolean,
): Promise<void> {
  if (updateAccount) {
    const accountResponse = await request(accountUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
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
      }),
    });
    if (!accountResponse.ok) {
      throw new Error(
        await readProblem(accountResponse, 'Could not update this account.'),
      );
    }
  }
  const response = await request(doctorsUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: doctor.id,
      birthDate: toIsoDate(dateInputValue(doctor.birthDate)),
      workStartDate: toIsoDate(dateInputValue(doctor.workStartDate)),
      officeId: doctor.officeId.trim(),
      specializationId: doctor.specializationId.trim(),
    }),
  });
  if (!response.ok) {
    throw new Error(
      await readProblem(response, 'Could not update this doctor.'),
    );
  }
}

export async function createDoctor(values: CreateDoctorValues): Promise<void> {
  const middleName = values.middleName.trim();
  const response = await request(registrationProxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
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
    }),
  });
  if (!response.ok) {
    throw new Error(
      await readProblem(response, 'Could not create the doctor.'),
    );
  }
}

async function request(url: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, {
      ...init,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...init?.headers,
      },
    });
  } catch {
    throw new Error('Could not reach the profiles service.');
  }
}

async function readProblem(
  response: Response,
  fallback: string,
): Promise<string> {
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

function readCatalog(value: unknown): DoctorCatalogPage {
  const record = readRecord(value);
  const itemsValue = record?.items ?? record?.Items;
  const items = Array.isArray(itemsValue)
    ? itemsValue
        .map((item) => readDoctor(item))
        .filter((item): item is DoctorSummary => item !== null)
    : [];
  const totalPages = readNumber(record?.totalPages ?? record?.TotalPages) ?? 0;
  const pageNumber = readNumber(record?.pageNumber ?? record?.PageNumber) ?? 0;
  return { items, totalPages, pageNumber };
}

function readDoctor(value: unknown): DoctorSummary | null {
  const record = readRecord(value);
  if (record === null) {
    return null;
  }
  const id = readString(record, 'id', 'Id');
  const accountId = readString(record, 'accountId', 'AccountId');
  const firstName = readString(record, 'firstName', 'FirstName') ?? '';
  const lastName = readString(record, 'lastName', 'LastName') ?? '';
  const birthDate = readString(record, 'birthDate', 'BirthDate');
  const workStartDate = readString(record, 'workStartDate', 'WorkStartDate');
  const officeId = readString(record, 'officeId', 'OfficeId');
  const specializationId = readString(
    record,
    'specializationId',
    'SpecializationId',
  );
  if (
    id === null ||
    accountId === null ||
    birthDate === null ||
    workStartDate === null ||
    officeId === null ||
    specializationId === null
  ) {
    return null;
  }
  const middleName = readString(record, 'middleName', 'MiddleName');
  return {
    id,
    accountId,
    firstName,
    lastName,
    middleName:
      middleName === null || middleName.length === 0 ? null : middleName,
    birthDate: dateInputValue(birthDate),
    workStartDate: dateInputValue(workStartDate),
    officeId,
    specializationId,
    email: null,
    phoneNumber: null,
    photoId: null,
    role: doctorRole,
  };
}

function readRecord(value: unknown): Record<string, unknown> | null {
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
  return typeof value === 'number' ? value : null;
}
