import DialogContent from '@mui/material/DialogContent';
import { dialogTitleClasses } from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';

export const FormContent = styled(DialogContent)(({ theme }) => ({
  [`.${dialogTitleClasses.root} + &`]: {
    paddingTop: theme.spacing(3),
  },
}));

export const RegistrationForm = styled('form')(({ theme }) => ({
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

export const InsurancePattern = styled('span')(({ theme }) => ({
  display: 'block',
  color: theme.palette.text.secondary,
}));

export const RequiredNote = styled('p')(({ theme }) => ({
  margin: 0,
  color: theme.palette.text.secondary,
  fontSize: theme.typography.body2.fontSize,
  lineHeight: theme.typography.body2.lineHeight,
}));

export const FieldIconSlot = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  color: theme.palette.text.secondary,
  '& svg': {
    fontSize: 22,
  },
}));
