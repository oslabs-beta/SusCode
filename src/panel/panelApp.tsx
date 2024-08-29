import * as React from 'react';
import * as vscode from 'vscode';
import { useEffect, useState } from 'react';
// import { getNonce } from './getNonce';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// const nonce = getNonce();

function App() {
  // const vscode = acquireVsCodeApi();

  // document
  //   .querySelector('.get-extensions-button')
  //   .addEventListener('click', () => {
  //     vscode.postMessage({ type: 'getExtensions' });
  //   });

  let filepath = '';

  window.addEventListener('message', (event) => {
    const message = event.data; // The json data that the extension sent
    switch (message.type) {
      case 'extensionPathReceived': {
        filepath = message;
      }
    }
  });

  //   function lookForEval(filepath) {}

  //   function lookForTypoSquatting(filepath) {}
  //   const evalMethodResults = lookForEval(filepath);

  //   function clickHandler(extensionPath) {
  //     vscode.postMessage({ type: 'extensionSelected', value: extensionPath });
  //   }
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
        <Typography variant='h1' fontWeight='bold'>
          SusCode!
        </Typography>
      </Box>

      <Box>
        <Tabs value={0}>
          <Tab label='Extension Name' />
        </Tabs>
        <Box sx={{ padding: 2 }}>
          <Typography variant='h5' fontWeight='bold'>
            Results of Security Scan for
          </Typography>
          <Typography variant='body1' fontWeight='light'>
            Use of eval() method found on line .
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
