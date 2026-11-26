import { httpClient, requireData } from '@/shared/api/http-client';
import { parseRegisteredAccountDto } from '@/shared/api/dto/profiles-dto';
import type {
  RegisterPatientDto,
  RegisteredAccountDto,
} from '@/shared/api/dto/profiles-dto';
import { registrationUrl } from '@/shared/config/auth';
import { toSignedInAccount } from '@/shared/session/signed-in-account';
import type { SignedInAccount } from '@/shared/session/signed-in-account';
import { createRegisterPatientDto } from '../model/patient-registration';
import type { PatientRegistrationValues } from '../model/patient-registration';

export async function registerPatient(
  values: PatientRegistrationValues,
): Promise<SignedInAccount> {
  const request: RegisterPatientDto = createRegisterPatientDto(values);
  const response = await httpClient.post<
    RegisteredAccountDto,
    RegisterPatientDto
  >(registrationUrl, request, {
    credentials: 'omit',
    fallbackMessage: 'Registration failed.',
    networkMessage: 'Could not reach the registration service.',
    parse: parseRegisteredAccountDto,
  });
  const registered = requireData(response);
  const account = toSignedInAccount(registered);
  if (account === null) {
    throw new Error('Registration did not return an account.');
  }
  return account;
}
