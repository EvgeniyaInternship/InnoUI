import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { createDoctor } from '../api/doctors';
import type { FacilityRecord } from '@/shared/api/facility';
import {
  emptyCreateDoctor,
  isEmail,
  isGuid,
  isPhoneNumber,
} from '../model/doctor';
import type { CreateDoctorValues } from '../model/doctor';
import {
  EditorForm,
  FieldGroup,
  FieldGroups,
  GroupTitle,
  WideControl,
} from './DoctorCatalog.styles';

type CreateDoctorDialogProps = {
  open: boolean;
  offices: FacilityRecord[];
  specializations: FacilityRecord[];
  onClose: () => void;
  onCreated: () => void;
};

export function CreateDoctorDialog({
  open,
  offices,
  specializations,
  onClose,
  onCreated,
}: CreateDoctorDialogProps) {
  const [values, setValues] = useState<CreateDoctorValues>(emptyCreateDoctor);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const update =
    (name: keyof CreateDoctorValues) =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      setValues((current) => ({ ...current, [name]: event.target.value }));
      setError(null);
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const message = validate(values);
    if (message !== null) {
      setError(message);
      return;
    }
    setIsSaving(true);
    void createDoctor(values)
      .then(() => {
        setValues(emptyCreateDoctor);
        onCreated();
      })
      .catch((createError: unknown) => {
        setError(
          createError instanceof Error
            ? createError.message
            : 'Could not create the doctor.',
        );
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Create doctor</DialogTitle>
      <DialogContent sx={{ paddingTop: 1 }}>
        <EditorForm id="create-doctor-form" onSubmit={handleSubmit}>
          <FieldGroups>
            <FieldGroup>
              <GroupTitle>Account</GroupTitle>
              <TextField
                label="Email"
                type="email"
                size="small"
                value={values.email}
                onChange={update('email')}
                required
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                size="small"
                value={values.password}
                onChange={update('password')}
                required
                fullWidth
              />
            </FieldGroup>
            <FieldGroup>
              <GroupTitle>Name</GroupTitle>
              <TextField
                label="First name"
                size="small"
                value={values.firstName}
                onChange={update('firstName')}
                required
                fullWidth
              />
              <TextField
                label="Middle name"
                size="small"
                value={values.middleName}
                onChange={update('middleName')}
                fullWidth
              />
              <WideControl>
                <TextField
                  label="Last name"
                  size="small"
                  value={values.lastName}
                  onChange={update('lastName')}
                  required
                  fullWidth
                />
              </WideControl>
            </FieldGroup>
            <FieldGroup>
              <GroupTitle>Contact</GroupTitle>
              <WideControl>
                <TextField
                  label="Phone number"
                  size="small"
                  value={values.phoneNumber}
                  onChange={update('phoneNumber')}
                  helperText="International format, such as +447911123456."
                  required
                  fullWidth
                />
              </WideControl>
            </FieldGroup>
            <FieldGroup>
              <GroupTitle>Practice</GroupTitle>
              {offices.length > 0 ? (
                <TextField
                  select
                  label="Office"
                  size="small"
                  value={values.officeId}
                  onChange={update('officeId')}
                  required
                  fullWidth
                >
                  {offices.map((office) => (
                    <MenuItem key={office.id} value={office.id}>
                      {office.title}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField
                  label="Office"
                  size="small"
                  value={values.officeId}
                  onChange={update('officeId')}
                  required
                  fullWidth
                />
              )}
              {specializations.length > 0 ? (
                <TextField
                  select
                  label="Specialization"
                  size="small"
                  value={values.specializationId}
                  onChange={update('specializationId')}
                  required
                  fullWidth
                >
                  {specializations.map((specialization) => (
                    <MenuItem key={specialization.id} value={specialization.id}>
                      {specialization.title}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField
                  label="Specialization"
                  size="small"
                  value={values.specializationId}
                  onChange={update('specializationId')}
                  required
                  fullWidth
                />
              )}
            </FieldGroup>
            <FieldGroup>
              <GroupTitle>Dates</GroupTitle>
              <DatePicker
                label="Birth date"
                value={values.birthDate === '' ? null : dayjs(values.birthDate)}
                disableFuture
                onChange={(value: Dayjs | null) =>
                  setValues((current) => ({
                    ...current,
                    birthDate: value?.isValid() ? value.format('YYYY-MM-DD') : '',
                  }))
                }
                slotProps={{
                  textField: { size: 'small', required: true, fullWidth: true },
                }}
              />
              <DatePicker
                label="Work start date"
                value={
                  values.workStartDate === '' ? null : dayjs(values.workStartDate)
                }
                disableFuture
                onChange={(value: Dayjs | null) =>
                  setValues((current) => ({
                    ...current,
                    workStartDate: value?.isValid()
                      ? value.format('YYYY-MM-DD')
                      : '',
                  }))
                }
                slotProps={{
                  textField: { size: 'small', required: true, fullWidth: true },
                }}
              />
            </FieldGroup>
          </FieldGroups>
          {error ? <Alert severity="error">{error}</Alert> : null}
        </EditorForm>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="create-doctor-form"
          variant="contained"
          disabled={isSaving}
        >
          {isSaving ? 'Creating doctor' : 'Create doctor'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function validate(values: CreateDoctorValues): string | null {
  if (!isEmail(values.email.trim())) {
    return 'Invalid email format.';
  }
  if (values.password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (values.firstName.trim().length === 0 || values.lastName.trim().length === 0) {
    return 'First name and last name are required.';
  }
  if (!isPhoneNumber(values.phoneNumber)) {
    return 'Invalid phone number format.';
  }
  if (values.birthDate.length === 0 || values.workStartDate.length === 0) {
    return 'Birth date and work start date must be in the past.';
  }
  if (!isGuid(values.officeId) || !isGuid(values.specializationId)) {
    return 'Choose an office and a specialization.';
  }
  return null;
}
