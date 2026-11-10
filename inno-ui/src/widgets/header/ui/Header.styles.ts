import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material/styles';
import { contentFrame } from '@/shared/ui/content-frame/content-frame.styles';

export const HeaderToolbar = styled(Toolbar)(({ theme }) => ({
  ...contentFrame(theme),
  minHeight: theme.spacing(8),
}));

export const Brand = styled('button')(({ theme }) => ({
  flexGrow: 1,
  padding: 0,
  border: 0,
  background: 'none',
  color: 'inherit',
  font: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: theme.typography.h6.fontSize,
  fontWeight: theme.typography.h6.fontWeight,
  lineHeight: theme.typography.h6.lineHeight,
}));
