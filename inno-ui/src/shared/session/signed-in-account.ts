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
    return readAccount(JSON.parse(stored) as unknown);
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
  try {
    const response = await fetch(url, { credentials: 'include' });
    if (!response.ok) {
      console.log(response.status);
      return null;
    }
    return readAccount(await response.json());
  } catch {
    return null;
  }
}

function readAccountRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  const record = value as Record<string, unknown>;
  if (
    typeof record.firstName === 'string' ||
    typeof record.FirstName === 'string'
  ) {
    return record;
  }
  const nested = record.account ?? record.Account;
  if (typeof nested === 'object' && nested !== null) {
    return nested as Record<string, unknown>;
  }
  return record;
}

function readAccount(value: unknown): SignedInAccount | null {
  const record = readAccountRecord(value);
  if (record === null) {
    return null;
  }
  const firstNameValue = record.firstName ?? record.FirstName;
  const lastNameValue = record.lastName ?? record.LastName;
  const middleNameValue = record.middleName ?? record.MiddleName;
  if (typeof firstNameValue !== 'string' || typeof lastNameValue !== 'string') {
    return null;
  }
  const firstName = firstNameValue.trim();
  const lastName = lastNameValue.trim();
  if (firstName.length === 0 || lastName.length === 0) {
    return null;
  }
  if (
    middleNameValue !== null &&
    middleNameValue !== undefined &&
    typeof middleNameValue !== 'string'
  ) {
    return null;
  }
  const middleName =
    typeof middleNameValue === 'string' ? middleNameValue.trim() : '';
  return {
    id: readId(record),
    role: readRole(record.role ?? record.Role),
    firstName,
    lastName,
    middleName: middleName.length === 0 ? null : middleName,
  };
}

const roleNames = ['', 'Admin', 'Receptionist', 'Doctor', 'Patient'];

function readId(record: Record<string, unknown>): string | null {
  const value = record.id ?? record.Id;
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function readRole(value: unknown): number | null {
  if (
    typeof value === 'number' &&
    roleNames[value] !== undefined &&
    value > 0
  ) {
    return value;
  }
  if (typeof value !== 'string') {
    return null;
  }
  const namedRole = roleNames.findIndex(
    (roleName) => roleName.toLowerCase() === value.toLowerCase(),
  );
  return namedRole > 0 ? namedRole : null;
}
