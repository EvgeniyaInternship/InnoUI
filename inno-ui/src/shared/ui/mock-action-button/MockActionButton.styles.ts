import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export const ActionCard = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: theme.spacing(1),
  padding: theme.spacing(3),
  textAlign: 'left',
  whiteSpace: 'normal',
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    borderColor: theme.palette.primary.main,
    boxShadow: 'none',
  },
}));

export const ActionIcon = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  color: theme.palette.primary.main,
  '& svg': {
    fontSize: 28,
  },
}));

export const ActionTitle = styled('span')(({ theme }) => ({
  fontSize: theme.typography.h6.fontSize,
  fontWeight: theme.typography.h6.fontWeight,
  lineHeight: theme.typography.h6.lineHeight,
}));

export const ActionText = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: theme.typography.body1.fontSize,
  fontWeight: theme.typography.fontWeightRegular,
  lineHeight: theme.typography.body1.lineHeight,
}));
