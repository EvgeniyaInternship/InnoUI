import { useState } from 'react';
import { AccountAccessDialog } from '@/widgets/account-access/ui/AccountAccessDialog';
import { Body } from '@/widgets/body/ui/Body';
import { Bottom } from '@/widgets/bottom/ui/Bottom';
import { Header } from '@/widgets/header/ui/Header';
import { PageMain, PageRoot } from './MainPage.styles';

export function MainPage() {
  const [isAccountAccessOpen, setIsAccountAccessOpen] = useState(false);

  const openAccountAccess = (): void => {
    setIsAccountAccessOpen(true);
  };

  const closeAccountAccess = (): void => {
    setIsAccountAccessOpen(false);
  };

  return (
    <PageRoot>
      <Header onSignIn={openAccountAccess} />
      <PageMain>
        <Body />
      </PageMain>
      <Bottom />
      <AccountAccessDialog
        open={isAccountAccessOpen}
        onClose={closeAccountAccess}
      />
    </PageRoot>
  );
}
