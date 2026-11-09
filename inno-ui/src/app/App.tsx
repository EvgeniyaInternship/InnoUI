import { MainPage } from '@/pages/main/ui/MainPage';
import { AppThemeProvider } from './providers/AppThemeProvider';

export function App() {
  return (
    <AppThemeProvider>
      <MainPage />
    </AppThemeProvider>
  );
}
