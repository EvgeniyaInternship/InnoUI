const authApiUrl = readApiUrl(
  import.meta.env.VITE_AUTH_API_URL,
  'VITE_AUTH_API_URL',
);
const profilesApiUrl = readApiUrl(
  import.meta.env.VITE_PROFILES_API_URL,
  'VITE_PROFILES_API_URL',
);

export const authLoginUrl = `${authApiUrl}/Auth/login`;
export const authLogoutUrl = `${authApiUrl}/Auth/logout`;
export const currentAccountUrl = '/profiles/Account/current';
export const accountUrl = '/profiles/Account';
export const currentPatientUrl = '/profiles/Patient/current';
export const patientUrl = '/profiles/Patient';
export const doctorsUrl = '/profiles/Doctor';
export const registrationProxyUrl = '/profiles/Registration';
export const facilityOfficesUrl = '/facility/Office';
export const facilitySpecializationsUrl = '/facility/Specialization';
export const facilityServicesUrl = '/facility/Service';
export const currentDoctorUrl = '/profiles/Doctor/current';
export const currentReceptionistUrl = '/profiles/Receptionist/current';
export const currentAdminUrl = '/profiles/Admin/current';
export const profilesCurrentAccountUrl = `${profilesApiUrl}/Account/current`;
export const registrationUrl = `${profilesApiUrl}/Registration`;

function readApiUrl(value: string | undefined, name: string): string {
  if (value === undefined || value.trim().length === 0) {
    throw new Error(`Missing ${name}. Set it in .env.`);
  }
  return value.replace(/\/$/, '');
}
