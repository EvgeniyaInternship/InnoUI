export const homePath = '/';
export const accountPath = '/account';
export const doctorsPath = '/doctors';

export function doctorAccountPath(doctorId: string): string {
  return `${doctorsPath}/${doctorId}`;
}
