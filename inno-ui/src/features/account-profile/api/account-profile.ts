import {
  accountUrl,
  currentAccountUrl,
  currentAdminUrl,
  currentDoctorUrl,
  currentPatientUrl,
  currentReceptionistUrl,
  patientUrl,
} from '@/shared/config/auth';
import type { SignedInAccount } from '@/shared/session/signed-in-account';
import {
  adminRole,
  createUpdateAccountDto,
  createUpdatePatientDto,
  doctorRole,
  receptionistRole,
} from '../model/account-profile';
import type {
  AccountDetails,
  PatientDetails,
  StaffDetails,
} from '../model/account-profile';

type ProblemBody = {
  detail?: string;
  title?: string;
  errors?: Record<string, string[]>;
};

const roleNames = ['', 'Admin', 'Receptionist', 'Doctor', 'Patient'];

export async function loadAccountDetails(): Promise<AccountDetails> {
  const response = await request(currentAccountUrl);
  if (!response.ok) {
    throw new Error(await readProblem(response, 'Could not load the account.'));
  }
  const account = readAccountDetails(await response.json());
  if (account === null) {
    throw new Error('Could not read the account.');
  }
  return account;
}

export async function loadPatientDetails(): Promise<PatientDetails | null> {
  const response = await request(currentPatientUrl);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(
      await readProblem(response, 'Could not load personal information.'),
    );
  }
  const patient = readPatientDetails(await response.json());
  if (patient === null) {
    throw new Error('Could not read personal information.');
  }
  return patient;
}

export async function loadStaffDetails(
  role: number,
): Promise<StaffDetails | null> {
  const url = staffUrl(role);
  if (url === null) {
    return null;
  }
  const response = await request(url);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(
      await readProblem(response, 'Could not load personal information.'),
    );
  }
  const details = readStaffDetails(await response.json(), role === doctorRole);
  if (details === null) {
    throw new Error('Could not read personal information.');
  }
  return details;
}

export async function updateAccountDetails(
  values: AccountDetails,
): Promise<SignedInAccount> {
  const response = await request(accountUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(createUpdateAccountDto(values)),
  });
  if (!response.ok) {
    throw new Error(
      await readProblem(response, 'Could not update the account.'),
    );
  }
  const middleName = values.middleName.trim();
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    middleName: middleName.length === 0 ? null : middleName,
  };
}

export async function updatePatientDetails(
  values: PatientDetails,
): Promise<void> {
  const response = await request(patientUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(createUpdatePatientDto(values)),
  });
  if (!response.ok) {
    throw new Error(
      await readProblem(response, 'Could not update personal information.'),
    );
  }
}

export async function deleteAccount(accountId: string): Promise<void> {
  const response = await request(`${accountUrl}/${accountId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(
      await readProblem(response, 'Could not delete the account.'),
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
    return statusFallback(response.status, fallback);
  }
  return statusFallback(response.status, fallback);
}

function statusFallback(status: number, fallback: string): string {
  if (status === 401) {
    return 'Sign in to manage this account.';
  }
  if (status === 403) {
    return 'You cannot change this account.';
  }
  return fallback;
}

function readAccountDetails(value: unknown): AccountDetails | null {
  const record = readRecord(value);
  if (record === null) {
    return null;
  }
  const id = readString(record, 'id', 'Id');
  const email = readString(record, 'email', 'Email');
  const phoneNumber = readString(record, 'phoneNumber', 'PhoneNumber');
  const firstName = readString(record, 'firstName', 'FirstName');
  const lastName = readString(record, 'lastName', 'LastName');
  const createdAt = readString(record, 'createdAt', 'CreatedAt');
  const role = readRole(record.role ?? record.Role);
  if (
    id === null ||
    email === null ||
    phoneNumber === null ||
    firstName === null ||
    lastName === null ||
    createdAt === null ||
    role === null
  ) {
    return null;
  }
  const middleName = readString(record, 'middleName', 'MiddleName') ?? '';
  const photoValue = record.photoId ?? record.PhotoId;
  const photoId = typeof photoValue === 'string' ? photoValue : null;
  return {
    id,
    email,
    phoneNumber,
    role,
    photoId,
    firstName,
    lastName,
    middleName,
    createdAt,
  };
}

function staffUrl(role: number): string | null {
  if (role === doctorRole) {
    return currentDoctorUrl;
  }
  if (role === receptionistRole) {
    return currentReceptionistUrl;
  }
  if (role === adminRole) {
    return currentAdminUrl;
  }
  return null;
}

function readStaffDetails(
  value: unknown,
  includesSpecialization: boolean,
): StaffDetails | null {
  const record = readRecord(value);
  if (record === null) {
    return null;
  }
  const birthDate = readDate(record.birthDate ?? record.BirthDate);
  const workStartDate = readDate(record.workStartDate ?? record.WorkStartDate);
  const officeId = readString(record, 'officeId', 'OfficeId');
  const specializationId = readString(
    record,
    'specializationId',
    'SpecializationId',
  );
  if (
    birthDate === null ||
    workStartDate === null ||
    officeId === null ||
    (includesSpecialization && specializationId === null)
  ) {
    return null;
  }
  return {
    birthDate,
    workStartDate,
    officeId,
    specializationId,
  };
}

function readPatientDetails(value: unknown): PatientDetails | null {
  const record = readRecord(value);
  if (record === null) {
    return null;
  }
  const id = readString(record, 'id', 'Id');
  const birthDate = readDate(record.birthDate ?? record.BirthDate);
  const insuranceNumber = readString(
    record,
    'insuranceNumber',
    'InsuranceNumber',
  );
  if (id === null || birthDate === null || insuranceNumber === null) {
    return null;
  }
  return { id, birthDate, insuranceNumber };
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

function readRole(value: unknown): number | null {
  if (typeof value === 'number' && roleNames[value] !== undefined) {
    return value;
  }
  if (typeof value !== 'string') {
    return null;
  }
  const namedRole = roleNames.findIndex(
    (roleName) => roleName.toLowerCase() === value.toLowerCase(),
  );
  if (namedRole > 0) {
    return namedRole;
  }
  const parsed = Number(value);
  return roleNames[parsed] === undefined ? null : parsed;
}

function readDate(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(value);
  return match?.[1] ?? null;
}
