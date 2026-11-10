import AppBar from '@mui/material/AppBar';
import { AccountMenu } from '@/features/account-menu/ui/AccountMenu';
import { SignInButton } from '@/features/sign-in/ui/SignInButton';
import type { SignedInAccount } from '@/shared/session/signed-in-account';
import { Brand, HeaderToolbar } from './Header.styles';

type HeaderProps = {
  account: SignedInAccount | null;
  onSignIn: () => void;
  onLogout: () => void;
};

export function Header({ account, onSignIn, onLogout }: HeaderProps) {
  return (
    <AppBar>
      <HeaderToolbar>
        <Brand>Clinic</Brand>
        {account ? (
          <AccountMenu account={account} onLogout={onLogout} />
        ) : (
          <SignInButton onClick={onSignIn} />
        )}
      </HeaderToolbar>
    </AppBar>
  );
}
