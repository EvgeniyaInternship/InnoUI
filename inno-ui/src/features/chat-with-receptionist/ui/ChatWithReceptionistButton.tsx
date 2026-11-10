import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import { MockActionButton } from '@/shared/ui/mock-action-button/MockActionButton';

export function ChatWithReceptionistButton() {
  return (
    <MockActionButton
      icon={<ChatOutlinedIcon />}
      label="Chat with receptionist"
      description="Ask the front desk."
      notice="Receptionist chat is not connected yet"
    />
  );
}
