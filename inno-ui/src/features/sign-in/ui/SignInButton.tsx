import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import { SignInButtonRoot } from './SignInButton.styles';

type SignInButtonProps = {
  onClick: () => void;
};

export function SignInButton({ onClick }: SignInButtonProps) {
  return (
    <SignInButtonRoot
      variant="outlined"
      startIcon={<LoginOutlinedIcon />}
      onClick={onClick}
    >
      Sign In
    </SignInButtonRoot>
  );
}
