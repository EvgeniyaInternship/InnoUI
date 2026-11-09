import type { CSSObject, Theme } from '@mui/material/styles';

export function contentFrame(theme: Theme): CSSObject {
  return {
    width: '100%',
    maxWidth: theme.layout.contentMaxWidth,
    marginInline: 'auto',
    paddingInline: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      paddingInline: theme.spacing(3),
    },
  };
}
