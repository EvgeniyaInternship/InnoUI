import { useEffect, useState } from 'react';
import { AccountPage } from '@/pages/account/ui/AccountPage';
import { DoctorsPage } from '@/pages/doctors/ui/DoctorsPage';
import { MainPage } from '@/pages/main/ui/MainPage';
import { ServicesPage } from '@/pages/services/ui/ServicesPage';
import { accountPath, doctorsPath, homePath, servicesPath } from '@/shared/config/routes';
import { authLogoutUrl } from '@/shared/config/auth';
import { useRoute } from '@/shared/lib/use-route';
import {
  clearSignedInAccount,
  loadSignedInAccount,
  readSignedInAccount,
  saveSignedInAccount,
} from '@/shared/session/signed-in-account';
import type { SignedInAccount } from '@/shared/session/signed-in-account';
import { AccountAccessDialog } from '@/widgets/account-access/ui/AccountAccessDialog';
import { Bottom } from '@/widgets/bottom/ui/Bottom';
import { Header } from '@/widgets/header/ui/Header';
import { PageMain, PageRoot } from './ClinicApp.styles';

export function ClinicApp() {
  const { path, navigate } = useRoute();
  const [isAccountAccessOpen, setIsAccountAccessOpen] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [account, setAccount] = useState<SignedInAccount | null>(
    readSignedInAccount,
  );

  useEffect(() => {
    let isCurrent = true;
    void loadSignedInAccount().then((nextAccount) => {
      if (!isCurrent) {
        return;
      }
      if (nextAccount !== null) {
        setAccount(nextAccount);
      }
      setIsSessionReady(true);
    });
    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    if (isSessionReady && path === accountPath && account === null) {
      navigate(homePath);
    }
  }, [account, isSessionReady, navigate, path]);

  const registerAccount = (nextAccount: SignedInAccount): void => {
    saveSignedInAccount(nextAccount);
    setAccount(nextAccount);
  };

  const logOut = (): void => {
    clearSignedInAccount();
    setAccount(null);
    navigate(homePath);
    window.location.assign(authLogoutUrl);
  };

  const showAccount = path === accountPath && account !== null;
  const doctorId = path.startsWith(`${doctorsPath}/`)
    ? path.slice(doctorsPath.length + 1)
    : null;
  const showDoctors = path === doctorsPath || doctorId !== null;
  const serviceId = path.startsWith(`${servicesPath}/`)
    ? path.slice(servicesPath.length + 1)
    : null;
  const showServices = path === servicesPath || serviceId !== null;

  return (
    <PageRoot>
      <Header
        account={account}
        onSignIn={() => setIsAccountAccessOpen(true)}
        onLogout={logOut}
        onHome={() => navigate(homePath)}
        onViewProfile={() => navigate(accountPath)}
      />
      <PageMain>
        {showAccount ? (
          <AccountPage
            onAccountUpdated={setAccount}
            onBack={() => navigate(homePath)}
            onDeleted={logOut}
          />
        ) : showDoctors ? (
          <DoctorsPage
            doctorId={doctorId}
            account={account}
            isSessionReady={isSessionReady}
          />
        ) : showServices ? (
          <ServicesPage serviceId={serviceId} account={account} />
        ) : (
          <MainPage />
        )}
      </PageMain>
      <Bottom />
      <AccountAccessDialog
        open={isAccountAccessOpen}
        onClose={() => setIsAccountAccessOpen(false)}
        onRegistered={registerAccount}
      />
    </PageRoot>
  );
}
