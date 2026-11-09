import { useState } from 'react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import {
  createRegisterPatientDto,
  emptyPatientRegistration,
  hasPatientRegistrationErrors,
  validatePatientRegistration,
} from '../model/patient-registration';
import type {
  PatientRegistrationValues,
  RegisterPatientDto,
} from '../model/patient-registration';
import {
  FieldGrid,
  FieldIconSlot,
  FormContent,
  InsurancePattern,
  RegistrationForm,
  RequiredNote,
  WideField,
} from './PatientRegistrationForm.styles';

type PatientRegistrationFormProps = {
  onCancel: () => void;
};

const formId = 'patient-registration-form';
const birthDateFormat = 'DD MMM YYYY';

export function PatientRegistrationForm({
  onCancel,
}: PatientRegistrationFormProps) {
  const [values, setValues] = useState(emptyPatientRegistration);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registration, setRegistration] = useState<RegisterPatientDto | null>(
    null,
  );
  const formatErrors = isSubmitted ? validatePatientRegistration(values) : {};

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const name = event.target.name as keyof PatientRegistrationValues;
    const value = event.target.value;
    setValues((current) => ({ ...current, [name]: value }));
    setRegistration(null);
  };

  const handleBirthDateChange = (value: Dayjs | null): void => {
    setValues((current) => ({
      ...current,
      birthDate: value?.isValid() ? value.format('YYYY-MM-DD') : '',
    }));
    setRegistration(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setIsSubmitted(true);
    const nextErrors = validatePatientRegistration(values);
    if (hasPatientRegistrationErrors(nextErrors)) {
      setRegistration(null);
      return;
    }
    setRegistration(createRegisterPatientDto(values));
  };

  return (
    <>
      <DialogTitle>Create an account</DialogTitle>
      <FormContent>
        <RegistrationForm id={formId} noValidate onSubmit={handleSubmit}>
          <RequiredNote>* required</RequiredNote>
          <FieldGrid>
            <WideField>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={values.email}
                onChange={handleChange}
                error={Boolean(formatErrors.email)}
                helperText={formatErrors.email}
                required
                fullWidth
                autoComplete="email"
                slotProps={{
                  input: { startAdornment: iconAdornment(EmailOutlinedIcon) },
                }}
              />
            </WideField>
            <WideField>
              <TextField
                name="password"
                label="Password"
                type="password"
                value={values.password}
                onChange={handleChange}
                required
                fullWidth
                autoComplete="new-password"
                slotProps={{
                  input: { startAdornment: iconAdornment(LockOutlinedIcon) },
                }}
              />
            </WideField>
            <TextField
              name="firstName"
              label="First name"
              value={values.firstName}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="given-name"
              slotProps={{
                input: { startAdornment: iconAdornment(PersonOutlinedIcon) },
              }}
            />
            <TextField
              name="lastName"
              label="Last name"
              value={values.lastName}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="family-name"
              slotProps={{
                input: { startAdornment: iconAdornment(BadgeOutlinedIcon) },
              }}
            />
            <WideField>
              <TextField
                name="middleName"
                label="Middle name"
                value={values.middleName}
                onChange={handleChange}
                fullWidth
                autoComplete="additional-name"
                slotProps={{
                  input: {
                    startAdornment: iconAdornment(AccountCircleOutlinedIcon),
                  },
                }}
              />
            </WideField>
            <WideField>
              <TextField
                name="phoneNumber"
                label="Phone number"
                type="tel"
                value={values.phoneNumber}
                onChange={handleChange}
                error={Boolean(formatErrors.phoneNumber)}
                helperText={
                  formatErrors.phoneNumber ??
                  'International format, such as +447911123456.'
                }
                required
                fullWidth
                autoComplete="tel"
                slotProps={{
                  input: { startAdornment: iconAdornment(PhoneOutlinedIcon) },
                }}
              />
            </WideField>
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
          {registration ? (
            <Alert severity="success">These details are ready to send.</Alert>
          ) : null}
        </RegistrationForm>
      </FormContent>
      <DialogActions>
        <Button
          type="button"
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={onCancel}
        >
          Back
        </Button>
        <Button type="submit" form={formId} variant="contained">
          Create account
        </Button>
      </DialogActions>
    </>
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
