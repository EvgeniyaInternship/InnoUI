import { useEffect, useState } from 'react';
import { authLogoutUrl } from '@/shared/config/auth';
import {
  clearSignedInAccount,
  loadSignedInAccount,
  readSignedInAccount,
  saveSignedInAccount,
} from '@/shared/session/signed-in-account';
import type { SignedInAccount } from '@/shared/session/signed-in-account';
import { AccountAccessDialog } from '@/widgets/account-access/ui/AccountAccessDialog';
import { Body } from '@/widgets/body/ui/Body';
import { Bottom } from '@/widgets/bottom/ui/Bottom';
import { Header } from '@/widgets/header/ui/Header';
import { PageMain, PageRoot } from './MainPage.styles';

export function MainPage() {
  const [isAccountAccessOpen, setIsAccountAccessOpen] = useState(false);
  const [account, setAccount] = useState<SignedInAccount | null>(
    readSignedInAccount,
  );

  useEffect(() => {
    let isCurrent = true;
    void loadSignedInAccount().then((nextAccount) => {
      if (!isCurrent || nextAccount === null) {
        return;
      }
      setAccount(nextAccount);
    });
    return () => {
      isCurrent = false;
    };
  }, []);

  const openAccountAccess = (): void => {
    setIsAccountAccessOpen(true);
  };

  const closeAccountAccess = (): void => {
    setIsAccountAccessOpen(false);
  };

  const registerAccount = (nextAccount: SignedInAccount): void => {
    saveSignedInAccount(nextAccount);
    setAccount(nextAccount);
  };

  const logOut = (): void => {
    clearSignedInAccount();
    setAccount(null);
    window.location.assign(authLogoutUrl);
  };

  return (
    <PageRoot>
      <Header
        account={account}
        onSignIn={openAccountAccess}
        onLogout={logOut}
      />
      <PageMain>
        <Body />
      </PageMain>
      <Bottom />
      <AccountAccessDialog
        open={isAccountAccessOpen}
        onClose={closeAccountAccess}
        onRegistered={registerAccount}
      />
    </PageRoot>
  );
}
