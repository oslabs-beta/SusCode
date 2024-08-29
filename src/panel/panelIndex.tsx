import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './panelApp';
import { CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
