import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { homePath, servicePath } from '@/shared/config/routes';
import { navigateTo } from '@/shared/lib/use-route';
import type { SignedInAccount } from '@/shared/session/signed-in-account';
import {
  emptyServiceFilter,
  loadNamedDoctors,
  loadServices,
} from '../api/services';
import type { NamedDoctor, ServiceFilter } from '../api/services';
import { loadSpecializations, recordTitle } from '@/shared/api/facility';
import type { DoctorService, FacilityRecord } from '@/shared/api/facility';
import { Pager } from '@/shared/ui/pager/Pager';
import { SpecializationIcon } from '@/shared/ui/specialization-icon/SpecializationIcon';
import { CreateServiceDialog } from './CreateServiceDialog';
import {
  BackButton,
  CardDescription,
  CardFooter,
  CatalogHeader,
  FilterActions,
  FilterFields,
  FilterPanel,
  Heading,
  NameRow,
  ServiceCard,
  ServiceGrid,
  ServiceMeta,
  ServicePage,
  SpecialtyMark,
  TitleRow,
} from './Services.styles';

type ServiceCatalogProps = {
  account: SignedInAccount | null;
};

export function ServiceCatalog({ account }: ServiceCatalogProps) {
  const [draft, setDraft] = useState<ServiceFilter>(emptyServiceFilter);
  const [filter, setFilter] = useState<ServiceFilter>(emptyServiceFilter);
  const [pageNumber, setPageNumber] = useState(0);
  const [services, setServices] = useState<DoctorService[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [doctors, setDoctors] = useState<NamedDoctor[]>([]);
  const [specializations, setSpecializations] = useState<FacilityRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const isAdmin = account?.role === 1;

  useEffect(() => {
    let isCurrent = true;
    void Promise.all([loadNamedDoctors(), loadSpecializations()]).then(
      ([nextDoctors, nextSpecializations]) => {
        if (!isCurrent) {
          return;
        }
        setDoctors(nextDoctors);
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
    void loadServices(filter, pageNumber)
      .then((page) => {
        if (!isCurrent) {
          return;
        }
        setServices(page.items);
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
            : 'Could not load services.',
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
    const minPrice = Number(draft.minPrice);
    const maxPrice = Number(draft.maxPrice);
    if (
      (draft.minPrice.trim().length > 0 && (Number.isNaN(minPrice) || minPrice < 0)) ||
      (draft.maxPrice.trim().length > 0 && (Number.isNaN(maxPrice) || maxPrice < 0))
    ) {
      setError('Price cannot be less than 0.');
      return;
    }
    setError(null);
    setPageNumber(0);
    setFilter(draft);
  };

  const keepPrice = (value: string): string => {
    if (value.trim().length === 0) {
      return '';
    }
    const price = Number(value);
    if (Number.isNaN(price) || price < 0) {
      return '';
    }
    return value;
  };

  return (
    <ServicePage>
      <CatalogHeader>
        <TitleRow>
          <BackButton
            type="button"
            startIcon={<ArrowBackOutlinedIcon />}
            onClick={() => navigateTo(homePath)}
          >
            Back
          </BackButton>
          <Heading>
            <Typography variant="h4" component="h1">
              Services
            </Typography>
            <Typography color="text.secondary">
              Filter by title, doctor, price, and whether the service is active.
            </Typography>
          </Heading>
          {isAdmin ? (
            <Button
              type="button"
              variant="contained"
              sx={{ marginLeft: 'auto', flexShrink: 0, alignSelf: 'flex-end' }}
              onClick={() => setIsCreating(true)}
            >
              Create service
            </Button>
          ) : null}
        </TitleRow>
      </CatalogHeader>
      <FilterPanel onSubmit={applyFilter}>
        <FilterFields>
          <TextField
            label="Title"
            size="small"
            value={draft.title}
            onChange={(event) =>
              setDraft((current) => ({ ...current, title: event.target.value }))
            }
            fullWidth
          />
          <TextField
            select
            label="Doctor"
            size="small"
            value={draft.doctorId}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                doctorId: event.target.value,
              }))
            }
            fullWidth
          >
            <MenuItem value="">Any doctor</MenuItem>
            {doctors.map((doctor) => (
              <MenuItem key={doctor.id} value={doctor.id}>
                {doctor.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Status"
            size="small"
            value={draft.isActive}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                isActive: event.target.value as ServiceFilter['isActive'],
              }))
            }
            fullWidth
          >
            <MenuItem value="">Any status</MenuItem>
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </TextField>
          <TextField
            label="Min price"
            size="small"
            type="number"
            value={draft.minPrice}
            slotProps={{ htmlInput: { min: 0 } }}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                minPrice: keepPrice(event.target.value),
              }))
            }
            fullWidth
          />
          <TextField
            label="Max price"
            size="small"
            type="number"
            value={draft.maxPrice}
            slotProps={{ htmlInput: { min: 0 } }}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                maxPrice: keepPrice(event.target.value),
              }))
            }
            fullWidth
          />
          <FilterActions>
            <Button type="submit" variant="contained">
              Search
            </Button>
            <Button
              type="button"
              onClick={() => {
                setDraft(emptyServiceFilter);
                setFilter(emptyServiceFilter);
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
        <Typography color="text.secondary">Loading services.</Typography>
      ) : null}
      {!isLoading && error === null && services.length === 0 ? (
        <Typography color="text.secondary">
          No services match this filter.
        </Typography>
      ) : null}
      <ServiceGrid>
        {services.map((service) => {
          const doctor = doctors.find((item) => item.id === service.doctorId);
          const specialization = recordTitle(
            specializations,
            doctor?.specializationId ?? '',
          );
          return (
            <ServiceCard
              key={service.id}
              unavailable={!service.isActive}
              onClick={() => navigateTo(servicePath(service.id))}
            >
              <NameRow>
                <SpecialtyMark aria-hidden="true">
                  <SpecializationIcon title={specialization} />
                </SpecialtyMark>
                <Typography component="span" variant="h6">
                  {service.title}
                </Typography>
              </NameRow>
              <CardDescription>{service.description}</CardDescription>
              <CardFooter>
                {service.isActive ? (
                  <span />
                ) : (
                  <Chip label="Unavailable yet" size="small" />
                )}
                <ServiceMeta>{`$${service.price.toFixed(2)}`}</ServiceMeta>
              </CardFooter>
            </ServiceCard>
          );
        })}
      </ServiceGrid>
      <Pager
        pageNumber={pageNumber}
        totalPages={totalPages}
        onPageChange={setPageNumber}
      />
      <CreateServiceDialog
        open={isCreating}
        doctors={doctors}
        onClose={() => setIsCreating(false)}
        onCreated={() => {
          setIsCreating(false);
          setPageNumber(0);
          setFilter({ ...filter });
        }}
      />
    </ServicePage>
  );
}
