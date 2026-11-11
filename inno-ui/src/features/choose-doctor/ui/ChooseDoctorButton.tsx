import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import { doctorsPath } from '@/shared/config/routes';
import { navigateTo } from '@/shared/lib/use-route';
import {
  ActionCard,
  ActionIcon,
  ActionText,
  ActionTitle,
} from '@/shared/ui/mock-action-button/MockActionButton.styles';

export function ChooseDoctorButton() {
  return (
    <ActionCard onClick={() => navigateTo(doctorsPath)}>
      <ActionIcon>
        <MedicalServicesOutlinedIcon />
      </ActionIcon>
      <ActionTitle>Choose doctor</ActionTitle>
      <ActionText>See who is available.</ActionText>
    </ActionCard>
  );
}
