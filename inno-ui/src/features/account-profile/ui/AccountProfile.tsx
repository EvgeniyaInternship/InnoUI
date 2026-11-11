import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { loadOffices, loadSpecializations, recordTitle } from '@/shared/api/facility';
import { saveSignedInAccount } from '@/shared/session/signed-in-account';
import type { SignedInAccount } from '@/shared/session/signed-in-account';
import {
  deleteAccount,
  updateAccountDetails,
  updatePatientDetails,
} from '../api/account-profile';
import {
  emptyPersonalMessage,
  formatAccountRole,
  formatProfileDate,
  hasFieldErrors,
  validateAccountDetails,
  validatePatientDetails,
} from '../model/account-profile';
import type {
  AccountDetails,
  PatientDetails,
  PatientFieldErrors,
  StaffDetails,
} from '../model/account-profile';
import {
  DangerZone,
  DetailLabel,
  DetailList,
  DetailRow,
  DetailValue,
  FieldGrid,
  FieldIconSlot,
  FormActions,
  IdentityCard,
  IdentityCopy,
  InsurancePattern,
  PhotoCaption,
  PhotoFrame,
  ProfileCard,
  BackButton,
  ProfileForm,
  ProfileHeading,
  ProfileLead,
  ProfilePage,
  ProfileTitleRow,
  WideField,
} from './AccountProfile.styles';

type AccountProfileProps = {
  account: AccountDetails;
  patient: PatientDetails | null;
  staff: StaffDetails | null;
  personalError: string | null;
  onAccountUpdated: (account: SignedInAccount) => void;
  onBack: () => void;
  onDeleted: () => void;
};

const birthDateFormat = 'DD MMM YYYY';

export function AccountProfile({
  account,
  patient,
  staff,
  personalError,
  onAccountUpdated,
  onBack,
  onDeleted,
}: AccountProfileProps) {
  const [displayAccount, setDisplayAccount] = useState(account);
  const createdOn = dayjs(displayAccount.createdAt);
  const createdLabel = createdOn.isValid()
    ? createdOn.format('DD MMM YYYY')
    : '';
  const handleAccountUpdated = (nextAccount: SignedInAccount): void => {
    setDisplayAccount((current) => ({
      ...current,
      firstName: nextAccount.firstName,
      lastName: nextAccount.lastName,
      middleName: nextAccount.middleName ?? '',
    }));
    onAccountUpdated(nextAccount);
  };

  return (
    <ProfilePage>
      <ProfileTitleRow>
        <BackButton
          type="button"
          onClick={onBack}
          startIcon={<ArrowBackOutlinedIcon />}
        >
          Back
        </BackButton>
        <ProfileHeading>
          <Typography variant="h4" component="h1">
            Your profile
          </Typography>
          <ProfileLead>
            Account details, personal information, and the profile photo.
          </ProfileLead>
        </ProfileHeading>
      </ProfileTitleRow>
      <IdentityCard variant="outlined">
        <PhotoFrame aria-hidden="true">
          <PersonOutlinedIcon />
        </PhotoFrame>
        <IdentityCopy>
          <Typography variant="h6" component="p">
            {displayAccount.firstName} {displayAccount.lastName}
          </Typography>
          <PhotoCaption>Profile photo</PhotoCaption>
          <Typography variant="body2" color="text.secondary">
            {formatAccountRole(displayAccount.role)}
            {createdLabel.length > 0 ? ` · Member since ${createdLabel}` : ''}
          </Typography>
        </IdentityCopy>
      </IdentityCard>
      <AccountDetailsForm
        account={account}
        onAccountUpdated={handleAccountUpdated}
      />
      {patient ? <PatientDetailsForm patient={patient} /> : null}
      {staff ? <StaffDetailsCard details={staff} /> : null}
      {patient === null && staff === null ? (
        <Alert severity={personalError ? 'error' : 'info'}>
          {personalError ?? emptyPersonalMessage(account.role)}
        </Alert>
      ) : null}
      <DangerZone>
        <DeleteAccountButton accountId={account.id} onDeleted={onDeleted} />
      </DangerZone>
    </ProfilePage>
  );
}

function StaffDetailsCard({ details }: { details: StaffDetails }) {
  const [officeTitle, setOfficeTitle] = useState(details.officeId);
  const [specializationTitle, setSpecializationTitle] = useState(
    details.specializationId,
  );

  useEffect(() => {
    let isCurrent = true;
    void Promise.all([loadOffices(), loadSpecializations()]).then(
      ([offices, specializations]) => {
        if (!isCurrent) {
          return;
        }
        setOfficeTitle(recordTitle(offices, details.officeId));
        if (details.specializationId !== null) {
          setSpecializationTitle(
            recordTitle(specializations, details.specializationId),
          );
        }
      },
    );
    return () => {
      isCurrent = false;
    };
  }, [details.officeId, details.specializationId]);

  return (
    <ProfileCard variant="outlined">
      <Typography variant="h6" component="h2">
        Personal information
      </Typography>
      <DetailList>
        <DetailRow>
          <DetailLabel>Birth date</DetailLabel>
          <DetailValue>{formatProfileDate(details.birthDate)}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>Work start date</DetailLabel>
          <DetailValue>{formatProfileDate(details.workStartDate)}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>Office</DetailLabel>
          <DetailValue>{officeTitle}</DetailValue>
        </DetailRow>
        {details.specializationId === null ? null : (
          <DetailRow>
            <DetailLabel>Specialization</DetailLabel>
            <DetailValue>{specializationTitle}</DetailValue>
          </DetailRow>
        )}
      </DetailList>
    </ProfileCard>
  );
}

function AccountDetailsForm({
  account,
  onAccountUpdated,
}: {
  account: AccountDetails;
  onAccountUpdated: (account: SignedInAccount) => void;
}) {
  const [values, setValues] = useState(account);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const formatErrors = isSubmitted ? validateAccountDetails(values) : {};

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const name = event.target.name as keyof AccountDetails;
    setValues((current) => ({ ...current, [name]: event.target.value }));
    setMessage(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setIsSubmitted(true);
    const nextErrors = validateAccountDetails(values);
    if (hasFieldErrors(nextErrors)) {
      return;
    }
    setIsSaving(true);
    setMessage(null);
    void updateAccountDetails(values)
      .then((nextAccount) => {
        saveSignedInAccount(nextAccount);
        onAccountUpdated(nextAccount);
        setIsError(false);
        setMessage('Account updated.');
      })
      .catch((error: unknown) => {
        setIsError(true);
        setMessage(
          error instanceof Error
            ? error.message
            : 'Could not update the account.',
        );
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <ProfileCard variant="outlined">
      <Typography variant="h6" component="h2">
        Account
      </Typography>
      <ProfileForm noValidate onSubmit={handleSubmit}>
        <FieldGrid>
          <WideField>
            <ProfileField
              name="email"
              label="Email"
              type="email"
              value={values.email}
              autoComplete="email"
              error={formatErrors.email}
              icon={EmailOutlinedIcon}
              onChange={handleChange}
            />
          </WideField>
          <WideField>
            <ProfileField
              name="phoneNumber"
              label="Phone number"
              type="tel"
              value={values.phoneNumber}
              autoComplete="tel"
              error={formatErrors.phoneNumber}
              helperText="International format, such as +447911123456."
              icon={PhoneOutlinedIcon}
              onChange={handleChange}
            />
          </WideField>
          <ProfileField
            name="firstName"
            label="First name"
            value={values.firstName}
            autoComplete="given-name"
            icon={PersonOutlinedIcon}
            onChange={handleChange}
          />
          <ProfileField
            name="lastName"
            label="Last name"
            value={values.lastName}
            autoComplete="family-name"
            icon={BadgeOutlinedIcon}
            onChange={handleChange}
          />
          <WideField>
            <ProfileField
              name="middleName"
              label="Middle name"
              value={values.middleName}
              autoComplete="additional-name"
              icon={AccountCircleOutlinedIcon}
              onChange={handleChange}
            />
          </WideField>
        </FieldGrid>
        {message ? (
          <Alert severity={isError ? 'error' : 'success'}>{message}</Alert>
        ) : null}
        <FormActions>
          <Button type="submit" variant="contained" disabled={isSaving}>
            {isSaving ? 'Saving account' : 'Save account'}
          </Button>
        </FormActions>
      </ProfileForm>
    </ProfileCard>
  );
}

function PatientDetailsForm({ patient }: { patient: PatientDetails }) {
  const [values, setValues] = useState(patient);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const formatErrors: PatientFieldErrors = isSubmitted
    ? validatePatientDetails(values)
    : {};

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValues((current) => ({
      ...current,
      insuranceNumber: event.target.value,
    }));
    setMessage(null);
  };

  const handleBirthDateChange = (value: Dayjs | null): void => {
    setValues((current) => ({
      ...current,
      birthDate: value?.isValid() ? value.format('YYYY-MM-DD') : '',
    }));
    setMessage(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setIsSubmitted(true);
    const nextErrors = validatePatientDetails(values);
    if (hasFieldErrors(nextErrors)) {
      return;
    }
    setIsSaving(true);
    setMessage(null);
    void updatePatientDetails(values)
      .then(() => {
        setIsError(false);
        setMessage('Personal information updated.');
      })
      .catch((error: unknown) => {
        setIsError(true);
        setMessage(
          error instanceof Error
            ? error.message
            : 'Could not update personal information.',
        );
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <ProfileCard variant="outlined">
      <Typography variant="h6" component="h2">
        Personal information
      </Typography>
      <ProfileForm noValidate onSubmit={handleSubmit}>
        <FieldGrid>
          <DatePicker
            label="Birth date"
            value={values.birthDate === '' ? null : dayjs(values.birthDate)}
            onChange={handleBirthDateChange}
            format={birthDateFormat}
            disableFuture
            slots={{ openPickerIcon: CalendarMonthOutlinedIcon }}
            slotProps={{
              textField: {
                required: true,
                fullWidth: true,
                error: Boolean(formatErrors.birthDate),
                helperText: formatErrors.birthDate,
                slotProps: {
                  input: {
                    startAdornment: iconAdornment(CalendarMonthOutlinedIcon),
                  },
                },
              },
            }}
          />
          <TextField
            name="insuranceNumber"
            label="Insurance number"
            value={values.insuranceNumber}
            onChange={handleChange}
            error={Boolean(formatErrors.insuranceNumber)}
            helperText={
              <>
                {formatErrors.insuranceNumber ? (
                  <span>{formatErrors.insuranceNumber}</span>
                ) : null}
                <InsurancePattern>
                  National Insurance number, such as AB 12 34 56 C.
                </InsurancePattern>
              </>
            }
            required
            fullWidth
            slotProps={{
              input: {
                startAdornment: iconAdornment(HealthAndSafetyOutlinedIcon),
              },
            }}
          />
        </FieldGrid>
        {message ? (
          <Alert severity={isError ? 'error' : 'success'}>{message}</Alert>
        ) : null}
        <FormActions>
          <Button type="submit" variant="contained" disabled={isSaving}>
            {isSaving
              ? 'Saving personal information'
              : 'Save personal information'}
          </Button>
        </FormActions>
      </ProfileForm>
    </ProfileCard>
  );
}

function DeleteAccountButton({
  accountId,
  onDeleted,
}: {
  accountId: string;
  onDeleted: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmDelete = (): void => {
    setIsDeleting(true);
    setError(null);
    void deleteAccount(accountId)
      .then(() => {
        onDeleted();
      })
      .catch((deleteError: unknown) => {
        setError(
          deleteError instanceof Error
            ? deleteError.message
            : 'Could not delete the account.',
        );
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  return (
    <>
      <Button
        type="button"
        color="error"
        variant="outlined"
        onClick={() => setIsOpen(true)}
      >
        Delete account
      </Button>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>Delete this account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The profile is removed and you are signed out.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            color="error"
            variant="contained"
            onClick={confirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting account' : 'Delete account'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function ProfileField({
  name,
  label,
  value,
  type = 'text',
  autoComplete,
  error,
  helperText,
  icon: Icon,
  onChange,
}: {
  name: keyof AccountDetails;
  label: string;
  value: string;
  type?: string;
  autoComplete: string;
  error?: string;
  helperText?: string;
  icon: typeof EmailOutlinedIcon;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <TextField
      name={name}
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      error={Boolean(error)}
      helperText={error ?? helperText}
      required={name !== 'middleName'}
      fullWidth
      autoComplete={autoComplete}
      slotProps={{
        input: { startAdornment: iconAdornment(Icon) },
      }}
    />
  );
}

function iconAdornment(Icon: typeof EmailOutlinedIcon): ReactNode {
  return (
    <InputAdornment position="start">
      <FieldIconSlot>
        <Icon />
      </FieldIconSlot>
    </InputAdornment>
  );
}
