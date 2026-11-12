import { ServiceCatalog } from '@/features/services/ui/ServiceCatalog';
import { ServiceView } from '@/features/services/ui/ServiceView';
import type { SignedInAccount } from '@/shared/session/signed-in-account';

type ServicesPageProps = {
  serviceId: string | null;
  account: SignedInAccount | null;
};

export function ServicesPage({ serviceId, account }: ServicesPageProps) {
  if (serviceId !== null) {
    return <ServiceView serviceId={serviceId} />;
  }
  return <ServiceCatalog account={account} />;
}
