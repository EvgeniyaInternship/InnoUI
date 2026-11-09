import AppBar from '@mui/material/AppBar';
import { SignInButton } from '@/features/sign-in/ui/SignInButton';
import { Brand, HeaderToolbar } from './Header.styles';

type HeaderProps = {
  onSignIn: () => void;
};

export function Header({ onSignIn }: HeaderProps) {
  return (
    <AppBar>
      <HeaderToolbar>
        <Brand>Clinic</Brand>
        <SignInButton onClick={onSignIn} />
      </HeaderToolbar>
    </AppBar>
  );
}
