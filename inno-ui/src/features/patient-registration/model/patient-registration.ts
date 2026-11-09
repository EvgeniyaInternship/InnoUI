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
