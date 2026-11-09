import { MockActionButton } from '@/shared/ui/mock-action-button/MockActionButton';

export function ChooseDoctorButton() {
  return (
    <MockActionButton
      label="Choose doctor"
      description="See who is available."
      notice="Choosing a doctor is not connected yet"
    />
  );
}
