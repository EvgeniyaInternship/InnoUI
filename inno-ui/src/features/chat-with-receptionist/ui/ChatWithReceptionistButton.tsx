import { MockActionButton } from '@/shared/ui/mock-action-button/MockActionButton';

export function ChatWithReceptionistButton() {
  return (
    <MockActionButton
      label="Chat with receptionist"
      description="Ask the front desk."
      notice="Receptionist chat is not connected yet"
    />
  );
}
