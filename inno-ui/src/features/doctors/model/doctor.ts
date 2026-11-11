export const adminRole = 1;
export const doctorRole = 3;
export const doctorPageSize = 9;

export type DoctorSummary = {
  id: string;
  accountId: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  birthDate: string;
  workStartDate: string;
  officeId: string;
  specializationId: string;
  email: string | null;
  phoneNumber: string | null;
  photoId: string | null;
  role: number;
};

export type DoctorFilter = {
  officeId: string;
  specializationId: string;
  workStartDate: string;
};

export type DoctorCatalogPage = {
  items: DoctorSummary[];
  totalPages: number;
  pageNumber: number;
};

export const emptyDoctorFilter: DoctorFilter = {
  officeId: '',
  specializationId: '',
  workStartDate: '',
};

export type CreateDoctorValues = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName: string;
  phoneNumber: string;
  birthDate: string;
  workStartDate: string;
  officeId: string;
  specializationId: string;
};

export const emptyCreateDoctor: CreateDoctorValues = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  middleName: '',
  phoneNumber: '',
  birthDate: '',
  workStartDate: '',
  officeId: '',
  specializationId: '',
};

const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;

export function doctorName(doctor: DoctorSummary): string {
  const middle = doctor.middleName?.trim() ?? '';
  return [doctor.firstName, middle, doctor.lastName]
    .filter((part) => part.length > 0)
    .join(' ');
}

export function canEditDoctor(role: number | null | undefined): boolean {
  return role === adminRole;
}

export function isGuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value.trim(),
  );
}

export function isEmail(value: string): boolean {
  const atIndex = value.indexOf('@');
  return (
    atIndex > 0 &&
    atIndex !== value.length - 1 &&
    atIndex === value.lastIndexOf('@')
  );
}

export function isPhoneNumber(value: string): boolean {
  return phoneNumberPattern.test(value.trim());
}

export function toIsoDate(value: string): string {
  return new Date(`${value}T00:00:00.000Z`).toISOString();
}

export function dateInputValue(value: string): string {
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(value);
  return match?.[1] ?? '';
}
