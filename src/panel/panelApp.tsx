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

  window.addEventListener('message', event => {
		const message = event.data;
		
		if (message.command === 'update') {
			
		} else if (message.command === 'end') {
			
		} else if (message.command === 'error') {
			
		}
		});


  useEffect(() => {
    window.addEventListener('message', (event) => {
      const contentDiv: any = document.getElementById('content');
      const message = event.data; // The json data that the extension sent
      switch (message.type) {
        case 'readMe': {
          setReadMe(message.value);
          break;
        }
        // Use of eval() method found on line .
        case 'update': {
          // contentDiv.innerText += message.text;
          contentDiv.innerHTML += '<p>' + message.text + '</p>';
          break;
        }
        case 'end': {
          contentDiv.innerHTML += '<hr/><strong>Finished reading ' + message.fileName + '</strong><hr/>';
          break;
        }
        case 'error': {
          contentDiv.innerHTML += '<p style="color:red;">' + message.text + '</p>';
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
          <div id="content"></div>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
