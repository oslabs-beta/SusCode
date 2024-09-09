import * as React from 'react';
import { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';

const vscode = acquireVsCodeApi();
let extensionNames: string[];

function App() {
  const [names, setNames] = useState<string[][]>([]);

  useEffect(() => {
    //====================   LISTENING FOR MESSAGES FROM suscode.getExtensions to list extensions in ListItem =================================//
    const messageListener = (event: MessageEvent) => {
      const message = event.data;
      const extensions = message.value;
      extensionNames = extensions;
      setNames(extensions);
    };

    window.addEventListener('message', messageListener);

    getExtensions();

    return () => {
      window.removeEventListener('message', messageListener);
    };
  }, []);

  const selectedExtensions: string[] = [];

  function scanExtensionsClick() {
    // filtering through the extension names to find the user's file path of extension installed to send to back end to begin scanning
    const selectedPaths = names
      .filter((name) => selectedExtensions.includes(name[0]))
      .map((name) => name[1]);
    const selectedNames = names
      .filter((name) => selectedExtensions.includes(name[0]))
      .map((name) => name[0]);
    vscode.postMessage({
      type: 'extensionSelected',
      value: [selectedPaths, selectedExtensions],
      name: selectedNames,
    });
  }

  function getExtensions() {
    vscode.postMessage({ type: 'getExtensions' });
  }

  function handleCheckboxClick(value: string) {
    selectedExtensions.push(value);
  }

  return (
    <Box
      sx={{
        m: 2,
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          width: '100%',
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'left',
          justifyContent: 'left',
        }}
      >
        <List>
          {names.map((name) => (
            <ListItem sx={{ color: '#cccccc' }} key={name[0]}>
              <Checkbox
                sx={{
                  color: '#cccccc',
                }}
                onClick={() => handleCheckboxClick(name[0])}
              />
              {name[0]}
              <Box
                sx={{
                  flexDirection: 'column',
                  alignItems: 'right',
                  justifyContent: 'right',
                }}
              ></Box>
            </ListItem>
          ))}
        </List>
        <Button variant='contained' onClick={() => scanExtensionsClick()}>
          Scan Extensions
        </Button>
      </Box>
    </Box>
  );
}

export default App;
