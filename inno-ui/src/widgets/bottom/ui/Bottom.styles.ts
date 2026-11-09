import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { contentFrame } from '@/shared/ui/content-frame/content-frame.styles';

export const FooterRoot = styled('footer')(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

export const FooterInner = styled('div')(({ theme }) => ({
  ...contentFrame(theme),
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1),
  paddingBlock: theme.spacing(2),
}));

export const FooterBrand = styled(Typography)({
  fontWeight: 600,
});

export const FooterNote = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));
