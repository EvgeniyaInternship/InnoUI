import { useEffect, useState } from 'react';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { loadSpecializations, recordTitle } from '@/shared/api/facility';
import type { DoctorService, FacilityRecord } from '@/shared/api/facility';
import { servicesPath } from '@/shared/config/routes';
import { navigateTo } from '@/shared/lib/use-route';
import { SpecializationIcon } from '@/shared/ui/specialization-icon/SpecializationIcon';
import { loadNamedDoctors, loadService, loadServicesByTitle } from '../api/services';
import type { NamedDoctor } from '../api/services';
import {
  BackButton,
  Description,
  Heading,
  NameRow,
  PriceLine,
  ProviderTable,
  ServicePage,
  SpecialtyMark,
  Summary,
  TitleRow,
} from './Services.styles';

type ServiceViewProps = {
  serviceId: string;
};

export function ServiceView({ serviceId }: ServiceViewProps) {
  const [service, setService] = useState<DoctorService | null>(null);
  const [offers, setOffers] = useState<DoctorService[]>([]);
  const [doctors, setDoctors] = useState<NamedDoctor[]>([]);
  const [specializations, setSpecializations] = useState<FacilityRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    void Promise.all([
      loadService(serviceId),
      loadNamedDoctors(),
      loadSpecializations(),
    ])
      .then(([nextService, doctors, nextSpecializations]) => {
        if (!isCurrent) {
          return;
        }
        setService(nextService);
        setDoctors(doctors);
        setSpecializations(nextSpecializations);
        setOffers([nextService]);
        return loadServicesByTitle(nextService.title).then((sameTitle) => {
          if (isCurrent && sameTitle.length > 0) {
            setOffers(sameTitle);
          }
        });
      })
      .catch((loadError: unknown) => {
        if (isCurrent) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Could not load this service.',
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
  }, [serviceId]);

  const doctor = doctors.find((item) => item.id === service?.doctorId) ?? null;
  const specialization = recordTitle(
    specializations,
    doctor?.specializationId ?? '',
  );

  return (
    <ServicePage>
      <TitleRow>
        <BackButton
          type="button"
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={() => navigateTo(servicesPath)}
        >
          Back
        </BackButton>
        <Heading>
          <NameRow>
            <SpecialtyMark aria-hidden="true">
              <SpecializationIcon title={specialization} />
            </SpecialtyMark>
            <Typography variant="h4" component="h1">
              {service?.title ?? 'Service'}
            </Typography>
            {service ? (
              <PriceLine>{`$${service.price.toFixed(2)}`}</PriceLine>
            ) : null}
          </NameRow>
          {specialization.length > 0 ? (
            <Typography color="text.secondary">{specialization}</Typography>
          ) : null}
        </Heading>
      </TitleRow>
      {isLoading ? (
        <Typography color="text.secondary">Loading this service.</Typography>
      ) : null}
      {error ? <Alert severity="error">{error}</Alert> : null}
      {service ? (
        <Summary style={{ opacity: service.isActive ? 1 : 0.6 }}>
          {service.isActive ? null : <Chip label="Unavailable yet" size="small" />}
          <Description>{service.description}</Description>
          <Typography variant="h6" component="h2">
            Doctors who provide this service
          </Typography>
          <ProviderTable>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Specialization</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {offers.map((offer) => {
                  const provider = doctors.find((item) => item.id === offer.doctorId);
                  const providerSpecialty = recordTitle(
                    specializations,
                    provider?.specializationId ?? '',
                  );
                  return (
                    <TableRow key={offer.id}>
                      <TableCell>{provider?.name ?? 'Doctor'}</TableCell>
                      <TableCell>{providerSpecialty}</TableCell>
                      <TableCell align="right">{`$${offer.price.toFixed(2)}`}</TableCell>
                      <TableCell>
                        {offer.isActive ? 'Available' : 'Unavailable yet'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ProviderTable>
          <Button
            type="button"
            variant="contained"
            sx={{ alignSelf: 'flex-end' }}
            onClick={() =>
              setNotice('Creating an appointment is not connected yet.')
            }
          >
            Create an appointment
          </Button>
          {notice ? <Alert severity="info">{notice}</Alert> : null}
        </Summary>
      ) : null}
    </ServicePage>
  );
}
