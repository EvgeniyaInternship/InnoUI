import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { doctorAccountPath, homePath } from '@/shared/config/routes';
import { navigateTo } from '@/shared/lib/use-route';
import type { SignedInAccount } from '@/shared/session/signed-in-account';
import { loadDoctors } from '../api/doctors';
import {
  loadOffices,
  loadSpecializations,
  recordTitle,
} from '@/shared/api/facility';
import type { FacilityRecord } from '@/shared/api/facility';
import { adminRole, doctorName, emptyDoctorFilter } from '../model/doctor';
import type { DoctorFilter, DoctorSummary } from '../model/doctor';
import { CreateDoctorDialog } from './CreateDoctorDialog';
import {
  BackButton,
  CatalogHeader,
  DoctorAvatar,
  DoctorCard,
  DoctorGrid,
  DoctorHeading,
  DoctorIdentity,
  DoctorMeta,
  DoctorPage,
  DoctorTitleRow,
  FilterActions,
  FilterFields,
  FilterPanel,
  PageRow,
} from './DoctorCatalog.styles';

type DoctorCatalogProps = {
  account: SignedInAccount | null;
};

export function DoctorCatalog({ account }: DoctorCatalogProps) {
  const [draft, setDraft] = useState<DoctorFilter>(emptyDoctorFilter);
  const [filter, setFilter] = useState<DoctorFilter>(emptyDoctorFilter);
  const [pageNumber, setPageNumber] = useState(0);
  const [doctors, setDoctors] = useState<DoctorSummary[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [offices, setOffices] = useState<FacilityRecord[]>([]);
  const [specializations, setSpecializations] = useState<FacilityRecord[]>([]);
  const isAdmin = account?.role === adminRole;
  const hasFacilityNames = offices.length > 0 || specializations.length > 0;

  useEffect(() => {
    let isCurrent = true;
    void Promise.all([loadOffices(), loadSpecializations()]).then(
      ([nextOffices, nextSpecializations]) => {
        if (!isCurrent) {
          return;
        }
        setOffices(nextOffices);
        setSpecializations(nextSpecializations);
      },
    );
    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    void loadDoctors(filter, pageNumber)
      .then((page) => {
        if (!isCurrent) {
          return;
        }
        setDoctors(page.items);
        setTotalPages(page.totalPages);
        setError(null);
      })
      .catch((loadError: unknown) => {
        if (!isCurrent) {
          return;
        }
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Could not load doctors.',
        );
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });
    return () => {
      isCurrent = false;
    };
  }, [filter, pageNumber, isCreating]);

  const applyFilter = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setPageNumber(0);
    setFilter(draft);
  };

  return (
    <DoctorPage>
      <CatalogHeader>
        <DoctorTitleRow>
          <BackButton
            type="button"
            startIcon={<ArrowBackOutlinedIcon />}
            onClick={() => navigateTo(homePath)}
          >
            Back
          </BackButton>
          <DoctorHeading>
            <Typography variant="h4" component="h1">
              Doctors
            </Typography>
            <Typography color="text.secondary">
              Filter by office, specialization, and work start date.
            </Typography>
          </DoctorHeading>
        </DoctorTitleRow>
        {isAdmin ? (
          <Button
            type="button"
            variant="contained"
            onClick={() => setIsCreating(true)}
          >
            Create doctor
          </Button>
        ) : null}
      </CatalogHeader>
      <FilterPanel onSubmit={applyFilter}>
        <FilterFields>
          {offices.length > 0 ? (
            <TextField
              select
              label="Office"
              size="small"
              value={draft.officeId}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  officeId: event.target.value,
                }))
              }
              fullWidth
            >
              <MenuItem value="">Any office</MenuItem>
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
              value={draft.officeId}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  officeId: event.target.value,
                }))
              }
              fullWidth
            />
          )}
          {specializations.length > 0 ? (
            <TextField
              select
              label="Specialization"
              size="small"
              value={draft.specializationId}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  specializationId: event.target.value,
                }))
              }
              fullWidth
            >
              <MenuItem value="">Any specialization</MenuItem>
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
              value={draft.specializationId}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  specializationId: event.target.value,
                }))
              }
              fullWidth
            />
          )}
          <DatePicker
            label="Work start date"
            value={
              draft.workStartDate === '' ? null : dayjs(draft.workStartDate)
            }
            onChange={(value: Dayjs | null) =>
              setDraft((current) => ({
                ...current,
                workStartDate: value?.isValid()
                  ? value.format('YYYY-MM-DD')
                  : '',
              }))
            }
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
          <FilterActions>
            <Button type="submit" variant="contained" size="medium">
              Search
            </Button>
            <Button
              type="button"
              size="medium"
              onClick={() => {
                setDraft(emptyDoctorFilter);
                setFilter(emptyDoctorFilter);
                setPageNumber(0);
              }}
            >
              Clear
            </Button>
          </FilterActions>
        </FilterFields>
      </FilterPanel>
      {error ? <Alert severity="error">{error}</Alert> : null}
      {isLoading ? (
        <Typography color="text.secondary">Loading doctors.</Typography>
      ) : null}
      {!isLoading && error === null && doctors.length === 0 ? (
        <Typography color="text.secondary">
          No doctors match this filter.
        </Typography>
      ) : null}
      <DoctorGrid>
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            onClick={() => navigateTo(doctorAccountPath(doctor.id))}
          >
            <DoctorIdentity>
              <DoctorAvatar aria-hidden="true">
                <PersonOutlinedIcon />
              </DoctorAvatar>
              <span>
                <Typography component="span" variant="h6">
                  {doctorName(doctor)}
                </Typography>
                <DoctorMeta>
                  {hasFacilityNames
                    ? recordTitle(specializations, doctor.specializationId)
                    : doctor.specializationId}
                </DoctorMeta>
                <DoctorMeta>
                  {dayjs(doctor.workStartDate).format('DD MMM YYYY')}
                </DoctorMeta>
              </span>
            </DoctorIdentity>
          </DoctorCard>
        ))}
      </DoctorGrid>
      {totalPages > 1 ? (
        <PageRow>
          <Button
            type="button"
            disabled={pageNumber === 0}
            onClick={() => setPageNumber((current) => current - 1)}
          >
            Previous
          </Button>
          <Button
            type="button"
            disabled={pageNumber + 1 >= totalPages}
            onClick={() => setPageNumber((current) => current + 1)}
          >
            Next
          </Button>
        </PageRow>
      ) : null}
      <CreateDoctorDialog
        open={isCreating}
        offices={offices}
        specializations={specializations}
        onClose={() => setIsCreating(false)}
        onCreated={() => {
          setIsCreating(false);
          setPageNumber(0);
          setFilter({ ...filter });
        }}
      />
    </DoctorPage>
  );
}
