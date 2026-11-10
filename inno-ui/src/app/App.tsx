import { AppThemeProvider } from './providers/AppThemeProvider';
import { ClinicApp } from './ClinicApp';

export function App() {
  return (
    <AppThemeProvider>
      <ClinicApp />
    </AppThemeProvider>
  );
}
