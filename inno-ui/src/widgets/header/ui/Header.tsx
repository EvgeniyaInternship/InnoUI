import AppBar from '@mui/material/AppBar';
import { AccountMenu } from '@/features/account-menu/ui/AccountMenu';
import { SignInButton } from '@/features/sign-in/ui/SignInButton';
import type { SignedInAccount } from '@/shared/session/signed-in-account';
import { Brand, HeaderToolbar } from './Header.styles';

type HeaderProps = {
  account: SignedInAccount | null;
  onSignIn: () => void;
  onLogout: () => void;
  onHome: () => void;
  onViewProfile: () => void;
};

export function Header({
  account,
  onSignIn,
  onLogout,
  onHome,
  onViewProfile,
}: HeaderProps) {
  return (
    <AppBar>
      <HeaderToolbar>
        <Brand type="button" onClick={onHome}>
          Clinic
        </Brand>
        {account ? (
          <AccountMenu
            account={account}
            onLogout={onLogout}
            onViewProfile={onViewProfile}
          />
        ) : (
          <SignInButton onClick={onSignIn} />
        )}
      </HeaderToolbar>
    </AppBar>
  );
}
