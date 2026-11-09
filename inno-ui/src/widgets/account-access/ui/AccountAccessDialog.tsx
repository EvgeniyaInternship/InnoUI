import { useState } from 'react';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { PatientRegistrationForm } from '@/features/patient-registration/ui/PatientRegistrationForm';
import { authLoginUrl } from '@/shared/config/auth';
import { ChoiceActions, ChoiceContent } from './AccountAccessDialog.styles';

type AccountAccessDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function AccountAccessDialog({
  open,
  onClose,
}: AccountAccessDialogProps) {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  const closeAll = (): void => {
    setIsRegistrationOpen(false);
    onClose();
  };

  const openRegistration = (): void => {
    setIsRegistrationOpen(true);
  };

  const closeRegistration = (): void => {
    setIsRegistrationOpen(false);
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
              onClick={closeAll}
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
      <Dialog
        open={open && isRegistrationOpen}
        onClose={closeAll}
        fullWidth
        maxWidth="sm"
        scroll="paper"
      >
        <PatientRegistrationForm onCancel={closeRegistration} />
      </Dialog>
    </>
  );
}
