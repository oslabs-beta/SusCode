import * as React from 'react';
import { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

const vscode = acquireVsCodeApi();
let extensionNames: string[];

function App() {
  const [names, setNames] = useState<string[][]>([]);
  const [error, setError] = useState<boolean>(false);
  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([]);

  useEffect(() => {
    //====================   LISTENING FOR MESSAGES FROM suscode.getExtensions to list extensions in ListItem =================================//
    const messageListener = (event: MessageEvent) => {
      const message = event.data;
      const extensions = message.value;
      extensionNames = extensions;
      setNames(extensions);

      // Initialize checked state for all extensions as false
      const initialState: { [key: string]: boolean } = {};
      extensions.forEach((extension: string[]) => {
        initialState[extension[0]] = false;
      });
      setChecked(initialState);
    };

    window.addEventListener('message', messageListener);

    getExtensions();

    return () => {
      window.removeEventListener('message', messageListener);
    };
  }, []);

  function scanExtensionsClick() {
    // filtering through the extension names to find the user's file path of extension installed to send to back end to begin scanning
    const selectedPaths = names
      .filter((name) => selectedExtensions.includes(name[0]))
      .map((name) => name[1]);
    const selectedNames = names
      .filter((name) => selectedExtensions.includes(name[0]))
      .map((name) => name[0]);

    if (selectedPaths.length === 0) {
      setError(true);
      return;
    }

    // console.log('selectedExtensions: ', selectedExtensions);
    // vscode.postMessage({
    //   type: 'selectedExtensionNames',
    //   value: selectedExtensions,
    // });
    vscode.postMessage({
      type: 'extensionSelected',
      value: [selectedPaths, selectedExtensions],
      name: selectedNames,
    });

    // Reset the checked state (uncheck all checkboxes)
    const resetCheckedState: { [key: string]: boolean } = {};
    names.forEach((name) => {
      resetCheckedState[name[0]] = false;
    });
    setChecked(resetCheckedState);

    setSelectedExtensions([]);
  }

  function getExtensions() {
    vscode.postMessage({ type: 'getExtensions' });
  }

  function handleCheckboxClick(value: string) {
    if (error === true) {
      setError(false);
    }

    setChecked((prevState) => ({
      ...prevState,
      [value]: !prevState[value],
    }));

    setSelectedExtensions((prevSelected) => {
      if (!prevSelected.includes(value)) {
        return [...prevSelected, value];
      } else {
        return prevSelected.filter((ext) => ext !== value);
      }
    });
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
                checked={checked[name[0]] || false}
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
        <Typography color='red' display={error ? 'block' : 'none'}>
          *No Extensions Selected
        </Typography>
      </Box>
    </Box>
  );
}

export default App;
