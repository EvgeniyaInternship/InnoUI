import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export const SignInButtonRoot = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  borderColor: theme.palette.primary.contrastText,
  '&:hover': {
    color: theme.palette.primary.contrastText,
    borderColor: theme.palette.primary.contrastText,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
}));
