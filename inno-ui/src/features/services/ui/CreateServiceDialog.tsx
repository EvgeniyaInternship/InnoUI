import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { createService } from '../api/services';
import type { NamedDoctor } from '../api/services';
import {
  EditorForm,
  FieldGroup,
  GroupTitle,
  WideControl,
} from './Services.styles';

type CreateServiceDialogProps = {
  open: boolean;
  doctors: NamedDoctor[];
  onClose: () => void;
  onCreated: () => void;
};

const emptyValues = {
  title: '',
  description: '',
  price: '',
  isActive: true,
  doctorId: '',
};

export function CreateServiceDialog({
  open,
  doctors,
  onClose,
  onCreated,
}: CreateServiceDialogProps) {
  const [values, setValues] = useState(emptyValues);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const update =
    (name: 'title' | 'description' | 'price' | 'doctorId') =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      setValues((current) => ({ ...current, [name]: event.target.value }));
      setError(null);
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const price = Number(values.price);
    if (values.title.trim().length === 0 || values.description.trim().length === 0) {
      setError('Title and description are required.');
      return;
    }
    if (Number.isNaN(price) || price < 0) {
      setError('Price must be zero or greater.');
      return;
    }
    if (values.doctorId.length === 0) {
      setError('Choose a doctor.');
      return;
    }
    setIsSaving(true);
    void createService(values)
      .then(() => {
        setValues(emptyValues);
        onCreated();
      })
      .catch((createError: unknown) => {
        setError(
          createError instanceof Error
            ? createError.message
            : 'Could not create the service.',
        );
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Create service</DialogTitle>
      <DialogContent sx={{ paddingTop: 1 }}>
        <EditorForm id="create-service-form" onSubmit={handleSubmit}>
          <FieldGroup>
            <GroupTitle>Service</GroupTitle>
            <TextField
              label="Title"
              size="small"
              value={values.title}
              onChange={update('title')}
              required
              fullWidth
            />
            <TextField
              label="Price"
              size="small"
              type="number"
              value={values.price}
              slotProps={{ htmlInput: { min: 0 } }}
              onChange={(event) => {
                const price = Number(event.target.value);
                if (event.target.value.trim().length > 0 && (Number.isNaN(price) || price < 0)) {
                  return;
                }
                update('price')(event);
              }}
              required
              fullWidth
            />
            <WideControl>
              <TextField
                label="Description"
                size="small"
                value={values.description}
                onChange={update('description')}
                required
                fullWidth
                multiline
                minRows={2}
              />
            </WideControl>
          </FieldGroup>
          <FieldGroup>
            <GroupTitle>Assignment</GroupTitle>
            <TextField
              select
              label="Doctor"
              size="small"
              value={values.doctorId}
              onChange={update('doctorId')}
              required
              fullWidth
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </MenuItem>
              ))}
            </TextField>
            <FormControlLabel
              control={
                <Switch
                  checked={values.isActive}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      isActive: event.target.checked,
                    }))
                  }
                />
              }
              label="Active"
            />
          </FieldGroup>
          {error ? <Alert severity="error">{error}</Alert> : null}
        </EditorForm>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="create-service-form"
          variant="contained"
          disabled={isSaving}
        >
          {isSaving ? 'Creating service' : 'Create service'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
