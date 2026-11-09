import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material/styles';
import { contentFrame } from '@/shared/ui/content-frame/content-frame.styles';

export const HeaderToolbar = styled(Toolbar)(({ theme }) => ({
  ...contentFrame(theme),
  minHeight: theme.spacing(8),
}));

export const Brand = styled('span')(({ theme }) => ({
  flexGrow: 1,
  fontSize: theme.typography.h6.fontSize,
  fontWeight: theme.typography.h6.fontWeight,
  lineHeight: theme.typography.h6.lineHeight,
}));
