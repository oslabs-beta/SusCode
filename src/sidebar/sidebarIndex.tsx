import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './sidebarApp';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Primary color for the button
    },
  },
});

console.log('ReactDOM.createRoot executed');

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
);
