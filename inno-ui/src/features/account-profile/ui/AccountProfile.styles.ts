import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

export const ProfilePage = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  paddingBlock: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    paddingBlock: theme.spacing(8),
  },
}));

export const ProfileIntro = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  maxWidth: 640,
}));

export const ProfileLead = styled('p')(({ theme }) => ({
  margin: 0,
  color: theme.palette.text.secondary,
}));

export const IdentityCard = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export const PhotoFrame = styled('div')(({ theme }) => ({
  display: 'grid',
  placeItems: 'center',
  flex: '0 0 auto',
  width: theme.spacing(16),
  height: theme.spacing(16),
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.main,
  '& svg': {
    fontSize: 72,
  },
}));

export const IdentityCopy = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

export const PhotoCaption = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: theme.typography.body2.fontSize,
}));

export const ProfileCard = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
}));

export const ProfileForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const FieldGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  gridTemplateColumns: '1fr',
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: '1fr 1fr',
  },
}));

export const WideField = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    gridColumn: '1 / -1',
  },
}));

export const FieldIconSlot = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  color: theme.palette.text.secondary,
  '& svg': {
    fontSize: 22,
  },
}));

export const InsurancePattern = styled('span')(({ theme }) => ({
  display: 'block',
  color: theme.palette.text.secondary,
}));

export const FormActions = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
});

export const DetailList = styled('dl')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(1.5),
  margin: 0,
}));

export const DetailRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.25),
}));

export const DetailLabel = styled('dt')(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: theme.typography.body2.fontSize,
}));

export const DetailValue = styled('dd')({
  margin: 0,
});

export const DangerZone = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
}));
