import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './sidebarApp';
import CssBaseline from '@mui/material/CssBaseline';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
      <CssBaseline>
      <App />
      </CssBaseline>
);
