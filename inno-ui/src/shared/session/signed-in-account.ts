import { httpClient } from '@/shared/api/http-client';
import { parseAccountResponseDto } from '@/shared/api/dto/profiles-dto';
import type { AccountDto } from '@/shared/api/dto/profiles-dto';
import {
  currentAccountUrl,
  profilesCurrentAccountUrl,
} from '@/shared/config/auth';

export type SignedInAccount = {
  id?: string | null;
  role?: number | null;
  firstName: string;
  middleName: string | null;
  lastName: string;
};

const storageKey = 'clinic.signedInAccount';

export function formatAccountLabel(account: SignedInAccount): string {
  const firstInitial = account.firstName.trim().charAt(0).toLocaleUpperCase();
  const middleName = account.middleName?.trim() ?? '';
  const middleInitial =
    middleName.length === 0
      ? ''
      : `${middleName.charAt(0).toLocaleUpperCase()}. `;
  return `${firstInitial}. ${middleInitial}${account.lastName.trim()}`;
}

export function readSignedInAccount(): SignedInAccount | null {
  try {
    const stored = sessionStorage.getItem(storageKey);
    if (stored === null) {
      return null;
    }
    return readStoredAccount(JSON.parse(stored) as unknown);
  } catch {
    return null;
  }
}

export function saveSignedInAccount(account: SignedInAccount): void {
  const current = readSignedInAccount();
  sessionStorage.setItem(
    storageKey,
    JSON.stringify({
      ...current,
      ...account,
      id: account.id ?? current?.id ?? null,
      role: account.role ?? current?.role ?? null,
    }),
  );
}

export function clearSignedInAccount(): void {
  sessionStorage.removeItem(storageKey);
}

export async function loadSignedInAccount(): Promise<SignedInAccount | null> {
  for (const url of [currentAccountUrl, profilesCurrentAccountUrl]) {
    const account = await requestCurrentAccount(url);
    if (account !== null) {
      saveSignedInAccount(account);
      return account;
    }
  }
  return readSignedInAccount();
}

async function requestCurrentAccount(
  url: string,
): Promise<SignedInAccount | null> {
  const response = await httpClient.get<AccountDto>(url, {
    parse: parseAccountResponseDto,
  });
  if (!response.ok || response.data === null) {
    return null;
  }
  return toSignedInAccount(response.data);
}

export function toSignedInAccount(account: {
  id?: string | null;
  role?: number | null;
  firstName: string;
  lastName: string;
  middleName?: string | null;
}): SignedInAccount | null {
  const firstName = account.firstName.trim();
  const lastName = account.lastName.trim();
  if (firstName.length === 0 || lastName.length === 0) {
    return null;
  }
  const middleName = account.middleName?.trim() ?? '';
  return {
    id: account.id,
    role: account.role,
    firstName,
    lastName,
    middleName: middleName.length === 0 ? null : middleName,
  };
}

function readStoredAccount(value: unknown): SignedInAccount | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  const record = value as Record<string, unknown>;
  const firstName =
    typeof record.firstName === 'string' ? record.firstName.trim() : '';
  const lastName =
    typeof record.lastName === 'string' ? record.lastName.trim() : '';
  if (firstName.length === 0 || lastName.length === 0) {
    return null;
  }
  const middleNameValue = record.middleName;
  if (
    middleNameValue !== null &&
    middleNameValue !== undefined &&
    typeof middleNameValue !== 'string'
  ) {
    return null;
  }
  const middleName =
    typeof middleNameValue === 'string' ? middleNameValue.trim() : '';
  const id =
    typeof record.id === 'string' && record.id.length > 0 ? record.id : null;
  const role =
    typeof record.role === 'number' && record.role > 0 ? record.role : null;
  return {
    id,
    role,
    firstName,
    lastName,
    middleName: middleName.length === 0 ? null : middleName,
  };
}
