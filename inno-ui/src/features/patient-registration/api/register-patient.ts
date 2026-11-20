import { httpClient } from '@/shared/api/http-client';
import { parseRegisteredUserDto } from '@/shared/api/dto/profiles-dto';
import type {
  RegisterPatientDto,
  RegisteredUserDto,
} from '@/shared/api/dto/profiles-dto';
import { registrationUrl } from '@/shared/config/auth';
import type { SignedInAccount } from '@/shared/session/signed-in-account';
import { createRegisterPatientDto } from '../model/patient-registration';
import type { PatientRegistrationValues } from '../model/patient-registration';

export async function registerPatient(
  values: PatientRegistrationValues,
): Promise<SignedInAccount> {
  const request: RegisterPatientDto = createRegisterPatientDto(values);
  const response = await httpClient.post<RegisteredUserDto, RegisterPatientDto>(
    registrationUrl,
    request,
    {
      credentials: 'omit',
      fallbackMessage: 'Registration failed.',
      networkMessage: 'Could not reach the registration service.',
      parse: parseRegisteredUserDto,
    },
  );
  if (!response.ok || response.data === null) {
    throw new Error(response.message);
  }
  const account = response.data.account;
  const firstName = account.firstName.trim();
  const lastName = account.lastName.trim();
  if (firstName.length === 0 || lastName.length === 0) {
    throw new Error('Registration did not return an account.');
  }
  const middleName = account.middleName?.trim() ?? '';
  return {
    firstName,
    lastName,
    middleName: middleName.length === 0 ? null : middleName,
  };
}
