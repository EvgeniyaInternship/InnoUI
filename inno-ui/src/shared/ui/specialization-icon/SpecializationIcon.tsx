import type { SvgIconComponent } from '@mui/icons-material';
import ChildCareOutlinedIcon from '@mui/icons-material/ChildCareOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import {
  resolveSpecializationKind,
  SpecializationKind,
} from './specialization-kind';

const specializationIcons: Record<SpecializationKind, SvgIconComponent> = {
  [SpecializationKind.Cardiology]: FavoriteBorderOutlinedIcon,
  [SpecializationKind.Dermatology]: SpaOutlinedIcon,
  [SpecializationKind.Pediatrics]: ChildCareOutlinedIcon,
  [SpecializationKind.FamilyMedicine]: GroupsOutlinedIcon,
  [SpecializationKind.Other]: MedicalServicesOutlinedIcon,
};

type SpecializationIconProps = {
  title: string;
};

export function SpecializationIcon({ title }: SpecializationIconProps) {
  const Icon = specializationIcons[resolveSpecializationKind(title)];
  return <Icon />;
}
