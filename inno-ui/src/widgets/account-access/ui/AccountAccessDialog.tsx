import { lazy, Suspense, useState } from 'react';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { authLoginUrl } from '@/shared/config/auth';
import type { SignedInAccount } from '@/shared/session/signed-in-account';
import { ChoiceActions, ChoiceContent } from './AccountAccessDialog.styles';

const PatientRegistrationForm = lazy(() =>
  import('@/features/patient-registration/ui/PatientRegistrationForm').then(
    (module) => ({
      default: module.PatientRegistrationForm,
    }),
  ),
);

type AccountAccessDialogProps = {
  open: boolean;
  onClose: () => void;
  onRegistered: (account: SignedInAccount) => void;
};

export function AccountAccessDialog({
  open,
  onClose,
  onRegistered,
}: AccountAccessDialogProps) {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [hasOpenedRegistration, setHasOpenedRegistration] = useState(false);

  const closeAll = (): void => {
    setIsRegistrationOpen(false);
    onClose();
  };

  const openRegistration = (): void => {
    setHasOpenedRegistration(true);
    setIsRegistrationOpen(true);
  };

  const closeRegistration = (): void => {
    setIsRegistrationOpen(false);
  };

  const finishRegistration = (account: SignedInAccount): void => {
    setIsRegistrationOpen(false);
    onClose();
    onRegistered(account);
  };

  return (
    <>
      <Dialog
        open={open && !isRegistrationOpen}
        onClose={closeAll}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Sign in or create an account</DialogTitle>
        <ChoiceContent>
          <Typography color="text.secondary">
            Sign in opens the clinic login. Create an account if you are a new
            patient.
          </Typography>
          <ChoiceActions>
            <Button
              component="a"
              href={authLoginUrl}
              variant="contained"
              fullWidth
              startIcon={<LoginOutlinedIcon />}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                window.location.assign(authLoginUrl);
              }}
            >
              Sign in
            </Button>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<PersonAddOutlinedIcon />}
              onClick={openRegistration}
            >
              Create an account
            </Button>
          </ChoiceActions>
        </ChoiceContent>
      </Dialog>
      {hasOpenedRegistration ? (
        <Dialog
          open={open && isRegistrationOpen}
          onClose={closeAll}
          fullWidth
          maxWidth="sm"
          scroll="paper"
        >
          <Suspense fallback={<ChoiceContent>Loading</ChoiceContent>}>
            <PatientRegistrationForm
              onCancel={closeRegistration}
              onRegistered={finishRegistration}
            />
          </Suspense>
        </Dialog>
      ) : null}
    </>
  );
}
