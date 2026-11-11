import { DoctorCatalog } from '@/features/doctors/ui/DoctorCatalog';
import { DoctorAccountView } from '@/features/doctors/ui/DoctorAccountView';
import type { SignedInAccount } from '@/shared/session/signed-in-account';

type DoctorsPageProps = {
  doctorId: string | null;
  account: SignedInAccount | null;
  isSessionReady: boolean;
};

export function DoctorsPage({
  doctorId,
  account,
  isSessionReady,
}: DoctorsPageProps) {
  if (doctorId !== null) {
    return (
      <DoctorAccountView
        doctorId={doctorId}
        account={account}
        isSessionReady={isSessionReady}
      />
    );
  }
  return <DoctorCatalog account={account} />;
}
