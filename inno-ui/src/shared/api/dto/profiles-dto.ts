import {
  asRecord,
  readField,
  readString,
  type JsonRecord,
} from '@/shared/api/json-record';

const roleNames = ['', 'Admin', 'Receptionist', 'Doctor', 'Patient'] as const;

export type AccountDto = {
  readonly id: string;
  readonly phoneNumber: string;
  readonly email: string;
  readonly role: number;
  readonly photoId: string | null;
  readonly firstName: string;
  readonly lastName: string;
  readonly middleName: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type StaffMemberDto = {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly accountId: string;
  readonly birthDate: string;
  readonly workStartDate: string;
  readonly officeId: string;
  readonly specializationId: string | null;
};

export type DoctorDto = StaffMemberDto & {
  readonly specializationId: string;
};

export type PatientDto = {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly accountId: string;
  readonly birthDate: string;
  readonly insuranceNumber: string;
};

export type UpdateAccountDto = {
  readonly id: string;
  readonly phoneNumber: string;
  readonly email: string;
  readonly role: number;
  readonly photoId: string | null;
  readonly firstName: string;
  readonly lastName: string;
  readonly middleName: string | null;
};

export type UpdatePatientDto = {
  readonly id: string;
  readonly birthDate: string;
  readonly insuranceNumber: string;
};

export type UpdateDoctorDto = {
  readonly id: string;
  readonly birthDate: string;
  readonly workStartDate: string;
  readonly officeId: string;
  readonly specializationId: string;
};

export type RegisterPatientDto = {
  readonly role: 'Patient';
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly middleName: string | null;
  readonly phoneNumber: string;
  readonly birthDate: string;
  readonly photoId: null;
  readonly insuranceNumber: string;
};

export type RegisterDoctorDto = {
  readonly role: 'Doctor';
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly middleName: string | null;
  readonly phoneNumber: string;
  readonly birthDate: string;
  readonly photoId: null;
  readonly workStartDate: string;
  readonly officeId: string;
  readonly specializationId: string;
};

export type RegisteredUserDto = {
  readonly role: string;
  readonly account: AccountDto;
};

export function parseAccountDto(value: unknown): AccountDto | null {
  const record = asRecord(value);
  if (record === null) {
    return null;
  }
  const id = readString(record, 'id');
  const phoneNumber = readString(record, 'phoneNumber');
  const email = readString(record, 'email');
  const firstName = readString(record, 'firstName');
  const lastName = readString(record, 'lastName');
  const createdAt = readString(record, 'createdAt');
  const role = readRole(readField(record, 'role'));
  if (
    id === null ||
    phoneNumber === null ||
    email === null ||
    firstName === null ||
    lastName === null ||
    createdAt === null ||
    role === null
  ) {
    return null;
  }
  const middleName = readOptionalString(record, 'middleName');
  if (middleName === undefined) {
    return null;
  }
  return {
    id,
    phoneNumber,
    email,
    role,
    photoId: readPhotoId(record),
    firstName,
    lastName,
    middleName,
    createdAt,
    updatedAt: readString(record, 'updatedAt') ?? createdAt,
  };
}

export function parseAccountResponseDto(value: unknown): AccountDto | null {
  const account = parseAccountDto(value);
  if (account !== null) {
    return account;
  }
  const record = asRecord(value);
  if (record === null) {
    return null;
  }
  return parseAccountDto(readField(record, 'account'));
}

export function parseDoctorDto(value: unknown): DoctorDto | null {
  const staff = parseStaffMemberDto(value);
  if (staff === null || staff.specializationId === null) {
    return null;
  }
  return { ...staff, specializationId: staff.specializationId };
}

export function parseStaffMemberDto(value: unknown): StaffMemberDto | null {
  const record = asRecord(value);
  if (record === null) {
    return null;
  }
  const id = readString(record, 'id');
  const accountId = readString(record, 'accountId');
  const birthDate = readString(record, 'birthDate');
  const workStartDate = readString(record, 'workStartDate');
  const officeId = readString(record, 'officeId');
  const specializationId = readOptionalString(record, 'specializationId');
  if (
    id === null ||
    accountId === null ||
    birthDate === null ||
    workStartDate === null ||
    officeId === null ||
    specializationId === undefined
  ) {
    return null;
  }
  return {
    id,
    createdAt: readString(record, 'createdAt') ?? '',
    updatedAt: readString(record, 'updatedAt') ?? '',
    accountId,
    birthDate,
    workStartDate,
    officeId,
    specializationId,
  };
}

export function parsePatientDto(value: unknown): PatientDto | null {
  const record = asRecord(value);
  if (record === null) {
    return null;
  }
  const id = readString(record, 'id');
  const accountId = readString(record, 'accountId');
  const birthDate = readString(record, 'birthDate');
  const insuranceNumber = readString(record, 'insuranceNumber');
  if (
    id === null ||
    accountId === null ||
    birthDate === null ||
    insuranceNumber === null
  ) {
    return null;
  }
  return {
    id,
    createdAt: readString(record, 'createdAt') ?? '',
    updatedAt: readString(record, 'updatedAt') ?? '',
    accountId,
    birthDate,
    insuranceNumber,
  };
}

export function parseRegisteredUserDto(
  value: unknown,
): RegisteredUserDto | null {
  const record = asRecord(value);
  if (record === null) {
    return null;
  }
  const account = parseAccountDto(readField(record, 'account'));
  const role = readString(record, 'role');
  if (account === null || role === null) {
    return null;
  }
  return { role, account };
}

function readRole(value: unknown): number | null {
  if (
    typeof value === 'number' &&
    roleNames[value] !== undefined &&
    value > 0
  ) {
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
  return roleNames[parsed] === undefined || parsed <= 0 ? null : parsed;
}

function readPhotoId(record: JsonRecord): string | null {
  const value = readField(record, 'photoId');
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function readOptionalString(
  record: JsonRecord,
  camelName: string,
): string | null | undefined {
  const value = readField(record, camelName);
  if (value === undefined || value === null) {
    return null;
  }
  return typeof value === 'string' ? value : undefined;
}
