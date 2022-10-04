import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#f09a8f',
      main: '#f06858',
      dark: '#f05444',
    },
    secondary: {
      main: '#f44336',
    },
  },
  typography: {
    h5: {
      fontSize: '18px',
    },
    body1: {
      fontSize: '16px',
    }
  },
  overrides: {
    MuiListItem: {
      root:{
        height: '35px',
      }
    },
  },
});
