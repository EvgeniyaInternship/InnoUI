import { registrationUrl } from '@/shared/config/auth';
import type { SignedInAccount } from '@/shared/session/signed-in-account';
import { createRegisterPatientDto } from '../model/patient-registration';
import type { PatientRegistrationValues } from '../model/patient-registration';

type ProblemBody = {
  detail?: string;
  title?: string;
  errors?: Record<string, string[]>;
};

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
  let response: Response;
  try {
    response = await fetch(registrationUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createRegisterPatientDto(values)),
    });
  } catch {
    throw new Error('Could not reach the registration service.');
  }
  if (!response.ok) {
    throw new Error(await readProblem(response));
  }
  const body = (await response.json()) as RegisteredPatientResponse;
  const account = readRegisteredAccount(body.account);
  if (account === null) {
    throw new Error('Registration did not return an account.');
  }
  return account;
}

async function readProblem(response: Response): Promise<string> {
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
    return 'Registration failed.';
  }
  return 'Registration failed.';
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
