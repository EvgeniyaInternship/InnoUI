export const homePath = '/';
export const accountPath = '/account';
export const doctorsPath = '/doctors';
export const servicesPath = '/services';

export function doctorAccountPath(doctorId: string): string {
  return `${doctorsPath}/${doctorId}`;
}

export function servicePath(serviceId: string): string {
  return `${servicesPath}/${serviceId}`;
}
