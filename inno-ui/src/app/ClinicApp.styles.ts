import { styled } from '@mui/material/styles';
import { contentFrame } from '@/shared/ui/content-frame/content-frame.styles';

export const PageRoot = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
}));

export const PageMain = styled('main')(({ theme }) => ({
  ...contentFrame(theme),
  flex: '1 1 auto',
}));
