import dayjs from 'dayjs';

export type AccountDetails = {
  id: string;
  email: string;
  phoneNumber: string;
  role: number;
  photoId: string | null;
  firstName: string;
  lastName: string;
  middleName: string;
  createdAt: string;
};

export type PatientDetails = {
  id: string;
  birthDate: string;
  insuranceNumber: string;
};

export type StaffDetails = {
  birthDate: string;
  workStartDate: string;
  officeId: string;
  specializationId: string | null;
};

export const adminRole = 1;
export const receptionistRole = 2;
export const doctorRole = 3;
export const patientRole = 4;

export type AccountFieldErrors = Partial<
  Pick<AccountDetails, 'email' | 'phoneNumber'>
>;

export type PatientFieldErrors = Partial<
  Pick<PatientDetails, 'birthDate' | 'insuranceNumber'>
>;

export type UpdateAccountDto = {
  id: string;
  phoneNumber: string;
  email: string;
  role: number;
  photoId: string | null;
  firstName: string;
  lastName: string;
  middleName: string | null;
};

export type UpdatePatientDto = {
  id: string;
  birthDate: string;
  insuranceNumber: string;
};

const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;
const nationalInsuranceNumberPattern =
  /^(?!(?:BG|GB|KN|NK|NT|TN|ZZ))[A-CEGHJ-PR-TW-Z][A-NP-Z](?:\s*\d{2}){3}\s*[A-D]$/i;

const roleLabels: Record<number, string> = {
  1: 'Admin',
  2: 'Receptionist',
  3: 'Doctor',
  4: 'Patient',
};

export function formatAccountRole(role: number): string {
  return roleLabels[role] ?? 'Account';
}

export function emptyPersonalMessage(role: number): string {
  const name = formatAccountRole(role).toLocaleLowerCase();
  return `This account has no ${name} profile.`;
}

export function formatProfileDate(value: string): string {
  const date = dayjs(value);
  return date.isValid() ? date.format('DD MMM YYYY') : value;
}

export function validateAccountDetails(
  values: AccountDetails,
): AccountFieldErrors {
  const errors: AccountFieldErrors = {};
  const email = values.email.trim();
  const phoneNumber = values.phoneNumber.trim();
  if (email.length > 0 && !isEmail(email)) {
    errors.email = 'Invalid email format.';
  }
  if (phoneNumber.length > 0 && !phoneNumberPattern.test(phoneNumber)) {
    errors.phoneNumber = 'Invalid phone number format.';
  }
  return errors;
}

export function validatePatientDetails(
  values: PatientDetails,
): PatientFieldErrors {
  const errors: PatientFieldErrors = {};
  const insuranceNumber = values.insuranceNumber.trim();
  if (
    insuranceNumber.length > 0 &&
    !nationalInsuranceNumberPattern.test(insuranceNumber)
  ) {
    errors.insuranceNumber = 'Invalid National Insurance Number format.';
  }
  if (!isPastDate(values.birthDate)) {
    errors.birthDate = 'Birth date must be in the past.';
  }
  return errors;
}

export function hasFieldErrors(
  errors: AccountFieldErrors | PatientFieldErrors,
): boolean {
  return Object.keys(errors).length > 0;
}

export function createUpdateAccountDto(
  values: AccountDetails,
): UpdateAccountDto {
  const middleName = values.middleName.trim();
  return {
    id: values.id,
    phoneNumber: values.phoneNumber.trim(),
    email: values.email.trim(),
    role: values.role,
    photoId: values.photoId,
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    middleName: middleName.length === 0 ? null : middleName,
  };
}

export function createUpdatePatientDto(
  values: PatientDetails,
): UpdatePatientDto {
  return {
    id: values.id,
    birthDate: new Date(`${values.birthDate}T00:00:00.000Z`).toISOString(),
    insuranceNumber: values.insuranceNumber.trim(),
  };
}

function isEmail(value: string): boolean {
  const atIndex = value.indexOf('@');
  return (
    atIndex > 0 &&
    atIndex !== value.length - 1 &&
    atIndex === value.lastIndexOf('@')
  );
}

function isPastDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.getTime() < Date.now();
}
