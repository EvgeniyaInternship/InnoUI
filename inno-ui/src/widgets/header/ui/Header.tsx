import AppBar from '@mui/material/AppBar';
import { SignInButton } from '@/features/sign-in/ui/SignInButton';
import { Brand, HeaderToolbar } from './Header.styles';

export function Header() {
  return (
    <AppBar>
      <HeaderToolbar>
        <Brand>Clinic</Brand>
        <SignInButton />
      </HeaderToolbar>
    </AppBar>
  );
}
