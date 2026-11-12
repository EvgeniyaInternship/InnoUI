import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import { servicesPath } from '@/shared/config/routes';
import { navigateTo } from '@/shared/lib/use-route';
import {
  ActionCard,
  ActionIcon,
  ActionText,
  ActionTitle,
} from '@/shared/ui/mock-action-button/MockActionButton.styles';

export function ChooseServiceButton() {
  return (
    <ActionCard onClick={() => navigateTo(servicesPath)}>
      <ActionIcon>
        <AssignmentOutlinedIcon />
      </ActionIcon>
      <ActionTitle>Choose service</ActionTitle>
      <ActionText>Pick what you need.</ActionText>
    </ActionCard>
  );
}
