import DialogContent from '@mui/material/DialogContent';
import { styled } from '@mui/material/styles';

export const ChoiceContent = styled(DialogContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  paddingTop: theme.spacing(1),
}));

export const ChoiceActions = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));
