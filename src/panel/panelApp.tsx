import * as React from 'react';
import * as vscode from 'vscode';
import { useEffect, useState } from 'react';
// import { getNonce } from './getNonce';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// const nonce = getNonce();

function App() {
  // initialize state for the read me description
  const [readMe, setReadMe] = useState<string>('');
  // initialize state for the eval scan

  // event listener is looking for vscode.postMessage({ type: 'readme', value: 'read me data string' });
  useEffect(() => {
    window.addEventListener('message', (event) => {
      const message = event.data; // The json data that the extension sent
      switch (message.type) {
        case 'readMe': {
          setReadMe(message.value);
          break;
        }
      }
    });
    return () => {
      window.removeEventListener('message', () => {});
    };
  });

  return (
    <Box
      sx={{
        width: '100vw',
        m: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '450px',
          m: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant='h4' fontWeight='bold'>
          SusCode Extension Scan Results: {readMe}
        </Typography>
      </Box>

      <Box>
        <Tabs value={0}>
          <Tab label='Scan Result:' />
        </Tabs>
        <Box sx={{ padding: 2 }}>
          <Typography variant='body1' fontWeight='light'>
            Use of eval() method found on line .
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
