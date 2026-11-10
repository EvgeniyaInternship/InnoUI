export type PatientRegistrationValues = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName: string;
  phoneNumber: string;
  birthDate: string;
  insuranceNumber: string;
};

const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;
const nationalInsuranceNumberPattern =
  /^(?!(?:BG|GB|KN|NK|NT|TN|ZZ))[A-CEGHJ-PR-TW-Z][A-NP-Z](?:\s*\d{2}){3}\s*[A-D]$/i;

export type RegisterPatientDto = {
  role: 'Patient';
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  phoneNumber: string;
  birthDate: string;
  photoId: null;
  insuranceNumber: string;
};

export type PatientRegistrationErrors = Partial<
  Pick<PatientRegistrationValues, 'email' | 'phoneNumber' | 'insuranceNumber'>
>;

export const emptyPatientRegistration: PatientRegistrationValues = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  middleName: '',
  phoneNumber: '',
  birthDate: '',
  insuranceNumber: '',
};

export function validatePatientRegistration(
  values: PatientRegistrationValues,
): PatientRegistrationErrors {
  const errors: PatientRegistrationErrors = {};
  const email = values.email.trim();
  const phoneNumber = values.phoneNumber.trim();
  const insuranceNumber = values.insuranceNumber.trim();
  if (email.length > 0 && !isAspNetCoreEmail(email)) {
    errors.email = 'Invalid email format.';
  }
  if (phoneNumber.length > 0 && !phoneNumberPattern.test(phoneNumber)) {
    errors.phoneNumber = 'Invalid phone number format.';
  }
  if (
    insuranceNumber.length > 0 &&
    !nationalInsuranceNumberPattern.test(insuranceNumber)
  ) {
    errors.insuranceNumber = 'Invalid National Insurance Number format.';
  }
  return errors;
}

export function hasPatientRegistrationErrors(
  errors: PatientRegistrationErrors,
): boolean {
  return Object.keys(errors).length > 0;
}

export function createRegisterPatientDto(
  values: PatientRegistrationValues,
): RegisterPatientDto {
  const middleName = values.middleName.trim();
  const birthDate =
    values.birthDate.length === 0
      ? ''
      : new Date(`${values.birthDate}T00:00:00.000Z`).toISOString();

  return {
    role: 'Patient',
    email: values.email.trim(),
    password: values.password,
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    middleName: middleName.length === 0 ? null : middleName,
    phoneNumber: values.phoneNumber.trim(),
    birthDate,
    photoId: null,
    insuranceNumber: values.insuranceNumber.trim(),
  };
}

function isAspNetCoreEmail(value: string): boolean {
  const atIndex = value.indexOf('@');
  return (
    atIndex > 0 &&
    atIndex !== value.length - 1 &&
    atIndex === value.lastIndexOf('@')
  );
}
