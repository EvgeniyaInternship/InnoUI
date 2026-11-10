import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import { styled } from '@mui/material/styles';

export const AccountButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  borderColor: theme.palette.primary.contrastText,
  '&:hover': {
    color: theme.palette.primary.contrastText,
    borderColor: theme.palette.primary.contrastText,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
}));

export const AccountMenuCard = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    marginTop: theme.spacing(1),
    minWidth: theme.spacing(28),
  },
}));
