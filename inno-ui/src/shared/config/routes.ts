import { buildUrl } from '@/shared/lib/build-url';

export const homePath = '/';
export const accountPath = '/account';
export const doctorsPath = '/doctors';
export const servicesPath = '/services';

export function doctorAccountPath(doctorId: string): string {
  return buildUrl(doctorsPath, { path: doctorId });
}

export function servicePath(serviceId: string): string {
  return buildUrl(servicesPath, { path: serviceId });
}
