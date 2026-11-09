import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { enUS } from '@mui/x-date-pickers/locales';
import 'dayjs/locale/en';
import type { ReactNode } from 'react';
import { theme } from '@/shared/config/theme';

type AppThemeProviderProps = {
  children: ReactNode;
};

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="en"
        localeText={
          enUS.components.MuiLocalizationProvider.defaultProps.localeText
        }
      >
        <CssBaseline />
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
}
