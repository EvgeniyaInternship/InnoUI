import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    layout: {
      contentMaxWidth: number;
    };
  }

  interface ThemeOptions {
    layout?: {
      contentMaxWidth?: number;
    };
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#146C80',
      dark: '#0E5160',
      light: '#E5F3F6',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#C96B5A',
      dark: '#A35345',
      light: '#F8E7E3',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#8A9468',
      dark: '#5C6544',
      light: '#F3F5EE',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F4F7F8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A2A32',
      secondary: '#5C6E78',
    },
    divider: '#D5DEE3',
  },
  typography: {
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  layout: {
    contentMaxWidth: 1120,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          height: '100%',
        },
        body: {
          minHeight: '100%',
        },
        '#root': {
          minHeight: '100%',
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        color: 'primary',
        position: 'sticky',
        elevation: 0,
      },
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiSnackbar: {
      defaultProps: {
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        autoHideDuration: 2500,
      },
    },
  },
});
