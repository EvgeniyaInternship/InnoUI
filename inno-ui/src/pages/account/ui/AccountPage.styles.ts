import { styled } from '@mui/material/styles';

export const ProfileStatus = styled('p')(({ theme }) => ({
  margin: 0,
  paddingBlock: theme.spacing(5),
  color: theme.palette.text.secondary,
}));

export const ProfileNotice = styled('div')(({ theme }) => ({
  paddingBlock: theme.spacing(5),
}));
