import { MockActionButton } from '@/shared/ui/mock-action-button/MockActionButton';

export function ChooseServiceButton() {
  return (
    <MockActionButton
      label="Choose service"
      description="Pick what you need."
      notice="Choosing a service is not connected yet"
    />
  );
}
