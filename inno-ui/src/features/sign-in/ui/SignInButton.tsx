import { useMockNotice } from '@/shared/lib/use-mock-notice';
import { MockNotice } from '@/shared/ui/mock-notice/MockNotice';
import { SignInButtonRoot } from './SignInButton.styles';

export function SignInButton() {
  const { isOpen, openNotice, closeNotice } = useMockNotice();

  return (
    <>
      <SignInButtonRoot variant="outlined" onClick={openNotice}>
        Sign In
      </SignInButtonRoot>
      <MockNotice
        open={isOpen}
        message="Sign in is not connected yet"
        onClose={closeNotice}
      />
    </>
  );
}
