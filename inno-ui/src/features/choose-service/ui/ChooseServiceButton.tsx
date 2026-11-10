import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import { MockActionButton } from '@/shared/ui/mock-action-button/MockActionButton';

export function ChooseServiceButton() {
  return (
    <MockActionButton
      icon={<AssignmentOutlinedIcon />}
      label="Choose service"
      description="Pick what you need."
      notice="Choosing a service is not connected yet"
    />
  );
}
