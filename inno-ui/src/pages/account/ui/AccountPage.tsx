import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import {
  loadAccountDetails,
  loadPatientDetails,
  loadStaffDetails,
} from '@/features/account-profile/api/account-profile';
import { AccountProfile } from '@/features/account-profile/ui/AccountProfile';
import type {
  AccountDetails,
  PatientDetails,
  StaffDetails,
} from '@/features/account-profile/model/account-profile';
import { patientRole } from '@/features/account-profile/model/account-profile';
import type { SignedInAccount } from '@/shared/session/signed-in-account';
import { ProfileNotice, ProfileStatus } from './AccountPage.styles';

type AccountPageProps = {
  onAccountUpdated: (account: SignedInAccount) => void;
  onBack: () => void;
  onDeleted: () => void;
};

export function AccountPage({
  onAccountUpdated,
  onBack,
  onDeleted,
}: AccountPageProps) {
  const [account, setAccount] = useState<AccountDetails | null>(null);
  const [patient, setPatient] = useState<PatientDetails | null>(null);
  const [staff, setStaff] = useState<StaffDetails | null>(null);
  const [personalError, setPersonalError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;
    void loadAccountDetails()
      .then(async (nextAccount) => {
        if (!isCurrent) {
          return;
        }
        setAccount(nextAccount);
        try {
          if (nextAccount.role === patientRole) {
            const nextPatient = await loadPatientDetails();
            if (isCurrent) {
              setPatient(nextPatient);
            }
          } else {
            const nextStaff = await loadStaffDetails(nextAccount.role);
            if (isCurrent) {
              setStaff(nextStaff);
            }
          }
        } catch (loadError: unknown) {
          if (isCurrent) {
            setPersonalError(
              loadError instanceof Error
                ? loadError.message
                : 'Could not load personal information.',
            );
          }
        }
      })
      .catch((loadError: unknown) => {
        if (!isCurrent) {
          return;
        }
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Could not load the account.',
        );
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });
    return () => {
      isCurrent = false;
    };
  }, []);

  if (isLoading) {
    return <ProfileStatus>Loading your profile.</ProfileStatus>;
  }
  if (error || account === null) {
    return (
      <ProfileNotice>
        <Alert severity="error">{error ?? 'Could not load the account.'}</Alert>
      </ProfileNotice>
    );
  }
  return (
    <AccountProfile
      account={account}
      patient={patient}
      staff={staff}
      personalError={personalError}
      onAccountUpdated={onAccountUpdated}
      onBack={onBack}
      onDeleted={onDeleted}
    />
  );
}
