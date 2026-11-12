import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { authLoginUrl } from '@/shared/config/auth';
import { doctorsPath } from '@/shared/config/routes';
import { navigateTo } from '@/shared/lib/use-route';
import type { SignedInAccount } from '@/shared/session/signed-in-account';
import { loadDoctor, updateDoctor } from '../api/doctors';
import {
  loadDoctorServices,
  loadOffices,
  loadSpecializations,
  recordTitle,
} from '@/shared/api/facility';
import type { DoctorService, FacilityRecord } from '@/shared/api/facility';
import { canEditDoctor, doctorName, isGuid, adminRole } from '../model/doctor';
import type { DoctorSummary } from '../model/doctor';
import {
  BackButton,
  DetailLabel,
  DetailList,
  DetailRow,
  DetailValue,
  DoctorAvatar,
  DoctorHeading,
  DoctorIdentity,
  DoctorMeta,
  DoctorPage,
  DoctorTitleRow,
  EditorForm,
  FieldGroup,
  FieldGroups,
  GroupTitle,
  ServiceSection,
  ServiceTableWrap,
  WideControl,
} from './DoctorCatalog.styles';

type DoctorAccountViewProps = {
  doctorId: string;
  account: SignedInAccount | null;
  isSessionReady: boolean;
};

const dateFormat = 'DD MMM YYYY';

export function DoctorAccountView({
  doctorId,
  account,
  isSessionReady,
}: DoctorAccountViewProps) {
  const [doctor, setDoctor] = useState<DoctorSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [offices, setOffices] = useState<FacilityRecord[]>([]);
  const [specializations, setSpecializations] = useState<FacilityRecord[]>([]);
  const [services, setServices] = useState<DoctorService[]>([]);

  useEffect(() => {
    if (!isSessionReady) {
      return;
    }
    if (account === null) {
      window.location.assign(authLoginUrl);
      return;
    }
    let isCurrent = true;
    setIsLoading(true);
    void loadDoctor(doctorId)
      .then((nextDoctor) => {
        if (isCurrent) {
          setDoctor(nextDoctor);
        }
      })
      .catch((loadError: unknown) => {
        if (isCurrent) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Could not load this doctor.',
          );
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });
    return () => {
      isCurrent = false;
    };
  }, [account, doctorId, isSessionReady]);

  useEffect(() => {
    if (doctor === null) {
      return;
    }
    let isCurrent = true;
    void Promise.all([
      loadOffices(),
      loadSpecializations(),
      loadDoctorServices(doctor.id),
    ]).then(([nextOffices, nextSpecializations, nextServices]) => {
      if (!isCurrent) {
        return;
      }
      setOffices(nextOffices);
      setSpecializations(nextSpecializations);
      setServices(nextServices);
    });
    return () => {
      isCurrent = false;
    };
  }, [doctor]);

  const isAdmin = account?.role === adminRole;
  const canEdit = canEditDoctor(account?.role);

  const save = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (doctor === null) {
      return;
    }
    if (!isGuid(doctor.officeId) || !isGuid(doctor.specializationId)) {
      setError('Office and specialization must be identifiers.');
      return;
    }
    setIsSaving(true);
    setError(null);
    void updateDoctor(doctor, isAdmin)
      .then(() => {
        setMessage('Doctor updated.');
      })
      .catch((saveError: unknown) => {
        setMessage(null);
        setError(
          saveError instanceof Error
            ? saveError.message
            : 'Could not update this doctor.',
        );
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <DoctorPage>
      <DoctorTitleRow>
        <BackButton
          type="button"
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={() => navigateTo(doctorsPath)}
        >
          Back
        </BackButton>
        <DoctorIdentity>
          <DoctorAvatar aria-hidden="true">
            <PersonOutlinedIcon />
          </DoctorAvatar>
          <DoctorHeading>
            <Typography variant="h4" component="h1">
              {doctor === null ? 'Doctor' : doctorName(doctor)}
            </Typography>
            <DoctorMeta>Doctor</DoctorMeta>
          </DoctorHeading>
        </DoctorIdentity>
      </DoctorTitleRow>
      {isLoading ? (
        <Typography color="text.secondary">Loading this doctor.</Typography>
      ) : null}
      {error ? <Alert severity="error">{error}</Alert> : null}
      {doctor ? (
        <>
          {canEdit ? (
            <EditorForm onSubmit={save}>
              <FieldGroups>
                {isAdmin ? (
                  <FieldGroup>
                    <GroupTitle>Name</GroupTitle>
                    <TextField
                      label="First name"
                      size="small"
                      value={doctor.firstName}
                      onChange={(event) =>
                        setDoctor((current) =>
                          current === null
                            ? current
                            : { ...current, firstName: event.target.value },
                        )
                      }
                      fullWidth
                    />
                    <TextField
                      label="Middle name"
                      size="small"
                      value={doctor.middleName ?? ''}
                      onChange={(event) =>
                        setDoctor((current) =>
                          current === null
                            ? current
                            : { ...current, middleName: event.target.value },
                        )
                      }
                      fullWidth
                    />
                    <WideControl>
                      <TextField
                        label="Last name"
                        size="small"
                        value={doctor.lastName}
                        onChange={(event) =>
                          setDoctor((current) =>
                            current === null
                              ? current
                              : { ...current, lastName: event.target.value },
                          )
                        }
                        fullWidth
                      />
                    </WideControl>
                  </FieldGroup>
                ) : null}
                <FieldGroup>
                  <GroupTitle>Contact</GroupTitle>
                  <TextField
                    label="Email"
                    size="small"
                    value={doctor.email ?? ''}
                    onChange={(event) =>
                      setDoctor((current) =>
                        current === null
                          ? current
                          : { ...current, email: event.target.value },
                      )
                    }
                    fullWidth
                    disabled={!isAdmin}
                  />
                  <TextField
                    label="Phone number"
                    size="small"
                    value={doctor.phoneNumber ?? ''}
                    onChange={(event) =>
                      setDoctor((current) =>
                        current === null
                          ? current
                          : { ...current, phoneNumber: event.target.value },
                      )
                    }
                    fullWidth
                    disabled={!isAdmin}
                  />
                  {isAdmin ? (
                    <WideControl>
                      <TextField
                        label="Photo"
                        size="small"
                        value={doctor.photoId ?? ''}
                        onChange={(event) =>
                          setDoctor((current) =>
                            current === null
                              ? current
                              : {
                                  ...current,
                                  photoId:
                                    event.target.value.trim().length === 0
                                      ? null
                                      : event.target.value,
                                },
                          )
                        }
                        fullWidth
                      />
                    </WideControl>
                  ) : null}
                </FieldGroup>
                <FieldGroup>
                  <GroupTitle>Practice</GroupTitle>
                  {specializations.length > 0 ? (
                    <TextField
                      select
                      label="Specialization"
                      size="small"
                      value={doctor.specializationId}
                      onChange={(event) =>
                        setDoctor((current) =>
                          current === null
                            ? current
                            : {
                                ...current,
                                specializationId: event.target.value,
                              },
                        )
                      }
                      fullWidth
                    >
                      {specializations.map((specialization) => (
                        <MenuItem
                          key={specialization.id}
                          value={specialization.id}
                        >
                          {specialization.title}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <TextField
                      label="Specialization"
                      size="small"
                      value={doctor.specializationId}
                      onChange={(event) =>
                        setDoctor((current) =>
                          current === null
                            ? current
                            : {
                                ...current,
                                specializationId: event.target.value,
                              },
                        )
                      }
                      fullWidth
                    />
                  )}
                  {offices.length > 0 ? (
                    <TextField
                      select
                      label="Office"
                      size="small"
                      value={doctor.officeId}
                      onChange={(event) =>
                        setDoctor((current) =>
                          current === null
                            ? current
                            : { ...current, officeId: event.target.value },
                        )
                      }
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
                      value={doctor.officeId}
                      onChange={(event) =>
                        setDoctor((current) =>
                          current === null
                            ? current
                            : { ...current, officeId: event.target.value },
                        )
                      }
                      fullWidth
                    />
                  )}
                </FieldGroup>
                <FieldGroup>
                  <GroupTitle>Dates</GroupTitle>
                  <DatePicker
                    label="Birth date"
                    value={
                      doctor.birthDate === '' ? null : dayjs(doctor.birthDate)
                    }
                    format={dateFormat}
                    disableFuture
                    onChange={(value: Dayjs | null) =>
                      setDoctor((current) =>
                        current === null
                          ? current
                          : {
                              ...current,
                              birthDate: value?.isValid()
                                ? value.format('YYYY-MM-DD')
                                : '',
                            },
                      )
                    }
                    slotProps={{
                      textField: { size: 'small', fullWidth: true },
                    }}
                  />
                  <DatePicker
                    label="Work start date"
                    value={
                      doctor.workStartDate === ''
                        ? null
                        : dayjs(doctor.workStartDate)
                    }
                    format={dateFormat}
                    disableFuture
                    onChange={(value: Dayjs | null) =>
                      setDoctor((current) =>
                        current === null
                          ? current
                          : {
                              ...current,
                              workStartDate: value?.isValid()
                                ? value.format('YYYY-MM-DD')
                                : '',
                            },
                      )
                    }
                    slotProps={{
                      textField: { size: 'small', fullWidth: true },
                    }}
                  />
                </FieldGroup>
              </FieldGroups>
              {message ? <Alert severity="success">{message}</Alert> : null}
              <Button type="submit" variant="contained" disabled={isSaving}>
                {isSaving ? 'Saving doctor' : 'Save doctor'}
              </Button>
            </EditorForm>
          ) : (
            <DetailList>
              <DetailRow>
                <DetailLabel>Email</DetailLabel>
                <DetailValue>{doctor.email ?? ''}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Phone number</DetailLabel>
                <DetailValue>{doctor.phoneNumber ?? ''}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Specialization</DetailLabel>
                <DetailValue>
                  {recordTitle(specializations, doctor.specializationId)}
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Office</DetailLabel>
                <DetailValue>{recordTitle(offices, doctor.officeId)}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Birth date</DetailLabel>
                <DetailValue>
                  {dayjs(doctor.birthDate).format(dateFormat)}
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Work start date</DetailLabel>
                <DetailValue>
                  {dayjs(doctor.workStartDate).format(dateFormat)}
                </DetailValue>
              </DetailRow>
            </DetailList>
          )}
          <ServiceSection>
            <Typography variant="h6" component="h2">
              Services
            </Typography>
            {services.length === 0 ? (
              <Typography color="text.secondary">
                This doctor has no services yet.
              </Typography>
            ) : (
              <ServiceTableWrap>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Service</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>{service.title}</TableCell>
                        <TableCell>{service.description}</TableCell>
                        <TableCell align="right">
                          {`$${service.price.toFixed(2)}`}
                        </TableCell>
                        <TableCell>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ServiceTableWrap>
            )}
          </ServiceSection>
        </>
      ) : null}
    </DoctorPage>
  );
}
