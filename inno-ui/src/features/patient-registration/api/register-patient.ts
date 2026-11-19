import { httpClient } from '@/shared/api/http-client';
import { registrationUrl } from '@/shared/config/auth';
import type { SignedInAccount } from '@/shared/session/signed-in-account';
import { createRegisterPatientDto } from '../model/patient-registration';
import type { PatientRegistrationValues } from '../model/patient-registration';

type RegisteredPatientResponse = {
  account?: {
    firstName?: unknown;
    lastName?: unknown;
    middleName?: unknown;
  };
};

export async function registerPatient(
  values: PatientRegistrationValues,
): Promise<SignedInAccount> {
  const response = await httpClient.post<RegisteredPatientResponse>(
    registrationUrl,
    createRegisterPatientDto(values),
    {
      credentials: 'omit',
      fallbackMessage: 'Registration failed.',
      networkMessage: 'Could not reach the registration service.',
    },
  );
  if (!response.ok || response.data === null) {
    throw new Error(response.message);
  }
  const account = readRegisteredAccount(response.data.account);
  if (account === null) {
    throw new Error('Registration did not return an account.');
  }
  return account;
}

function readRegisteredAccount(
  account: RegisteredPatientResponse['account'],
): SignedInAccount | null {
  if (
    account === undefined ||
    typeof account.firstName !== 'string' ||
    typeof account.lastName !== 'string'
  ) {
    return null;
  }
  const firstName = account.firstName.trim();
  const lastName = account.lastName.trim();
  if (firstName.length === 0 || lastName.length === 0) {
    return null;
  }
  const middleName =
    typeof account.middleName === 'string' ? account.middleName.trim() : '';
  return {
    firstName,
    lastName,
    middleName: middleName.length === 0 ? null : middleName,
  };
}
