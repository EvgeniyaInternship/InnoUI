import ChildCareOutlinedIcon from '@mui/icons-material/ChildCareOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';

type SpecializationIconProps = {
  title: string;
};

export function SpecializationIcon({ title }: SpecializationIconProps) {
  const name = title.toLowerCase();
  if (name.includes('cardio') || name.includes('heart')) {
    return <FavoriteBorderOutlinedIcon />;
  }
  if (name.includes('dermat') || name.includes('skin')) {
    return <SpaOutlinedIcon />;
  }
  if (name.includes('pediatr') || name.includes('child')) {
    return <ChildCareOutlinedIcon />;
  }
  if (name.includes('family') || name.includes('general')) {
    return <GroupsOutlinedIcon />;
  }
  return <MedicalServicesOutlinedIcon />;
}
