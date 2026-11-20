import { httpClient } from '@/shared/api/http-client';
import type { EmptySuccess, HttpResult } from '@/shared/api/http-client';
import { profilesHttpOptions } from '@/shared/api/http-options';
import {
  parseAccountDto,
  parseDoctorDto,
  parsePatientDto,
  parseStaffMemberDto,
} from '@/shared/api/dto/profiles-dto';
import type {
  AccountDto,
  PatientDto,
  StaffMemberDto,
  UpdateAccountDto,
  UpdatePatientDto,
} from '@/shared/api/dto/profiles-dto';
import {
  accountUrl,
  currentAccountUrl,
  currentAdminUrl,
  currentDoctorUrl,
  currentPatientUrl,
  currentReceptionistUrl,
  patientUrl,
} from '@/shared/config/auth';
import { buildUrl } from '@/shared/lib/build-url';
import { dateInputValue } from '@/shared/lib/iso-date';
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

export async function loadAccountDetails(): Promise<AccountDetails> {
  const response = await httpClient.get<AccountDto>(currentAccountUrl, {
    ...profilesHttpOptions,
    fallbackMessage: 'Could not load the account.',
    parse: parseAccountDto,
  });
  if (!response.ok) {
    throw new Error(
      accountFailureMessage(response, 'Could not load the account.'),
    );
  }
  return toAccountDetails(response.data);
}

export async function loadPatientDetails(): Promise<PatientDetails | null> {
  const response = await httpClient.get<PatientDto>(currentPatientUrl, {
    ...profilesHttpOptions,
    fallbackMessage: 'Could not load personal information.',
    parse: parsePatientDto,
  });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(
      accountFailureMessage(response, 'Could not load personal information.'),
    );
  }
  return toPatientDetails(response.data);
}

export async function loadStaffDetails(
  role: number,
): Promise<StaffDetails | null> {
  const url = staffUrl(role);
  if (url === null) {
    return null;
  }
  const response = await httpClient.get<StaffMemberDto>(url, {
    ...profilesHttpOptions,
    fallbackMessage: 'Could not load personal information.',
    parse: role === doctorRole ? parseDoctorDto : parseStaffMemberDto,
  });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(
      accountFailureMessage(response, 'Could not load personal information.'),
    );
  }
  return toStaffDetails(response.data);
}

export async function updateAccountDetails(
  values: AccountDetails,
): Promise<SignedInAccount> {
  const request: UpdateAccountDto = createUpdateAccountDto(values);
  const response = await httpClient.put<EmptySuccess, UpdateAccountDto>(
    accountUrl,
    request,
    {
      ...profilesHttpOptions,
      fallbackMessage: 'Could not update the account.',
    },
  );
  if (!response.ok) {
    throw new Error(
      accountFailureMessage(response, 'Could not update the account.'),
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
  const request: UpdatePatientDto = createUpdatePatientDto(values);
  const response = await httpClient.put<EmptySuccess, UpdatePatientDto>(
    patientUrl,
    request,
    {
      ...profilesHttpOptions,
      fallbackMessage: 'Could not update personal information.',
    },
  );
  if (!response.ok) {
    throw new Error(
      accountFailureMessage(response, 'Could not update personal information.'),
    );
  }
}

export async function deleteAccount(accountId: string): Promise<void> {
  const response = await httpClient.delete(
    buildUrl(accountUrl, { path: accountId }),
    {
      ...profilesHttpOptions,
      fallbackMessage: 'Could not delete the account.',
    },
  );
  if (!response.ok) {
    throw new Error(
      accountFailureMessage(response, 'Could not delete the account.'),
    );
  }
}

function accountFailureMessage<T>(
  result: HttpResult<T>,
  fallback: string,
): string {
  if (result.message.length > 0 && result.message !== fallback) {
    return result.message;
  }
  if (result.status === 401) {
    return 'Sign in to manage this account.';
  }
  if (result.status === 403) {
    return 'You cannot change this account.';
  }
  return fallback;
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

function toAccountDetails(account: AccountDto): AccountDetails {
  return {
    id: account.id,
    email: account.email,
    phoneNumber: account.phoneNumber,
    role: account.role,
    photoId: account.photoId,
    firstName: account.firstName,
    lastName: account.lastName,
    middleName: account.middleName ?? '',
    createdAt: account.createdAt,
  };
}

function toPatientDetails(patient: PatientDto): PatientDetails {
  return {
    id: patient.id,
    birthDate: dateInputValue(patient.birthDate),
    insuranceNumber: patient.insuranceNumber,
  };
}

function toStaffDetails(staff: StaffMemberDto): StaffDetails {
  return {
    birthDate: dateInputValue(staff.birthDate),
    workStartDate: dateInputValue(staff.workStartDate),
    officeId: staff.officeId,
    specializationId: staff.specializationId,
  };
}
