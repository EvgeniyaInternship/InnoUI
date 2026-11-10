import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import { MockActionButton } from '@/shared/ui/mock-action-button/MockActionButton';

export function ChooseDoctorButton() {
  return (
    <MockActionButton
      icon={<MedicalServicesOutlinedIcon />}
      label="Choose doctor"
      description="See who is available."
      notice="Choosing a doctor is not connected yet"
    />
  );
}
