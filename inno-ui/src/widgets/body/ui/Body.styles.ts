import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

export const Section = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
  paddingBlock: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    paddingBlock: theme.spacing(8),
  },
}));

export const SectionIntro = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  maxWidth: 640,
}));

export const SectionLead = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const ActionGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  alignItems: 'stretch',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 16rem), 1fr))',
}));
