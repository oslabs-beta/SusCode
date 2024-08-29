import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { SelectChangeEvent } from '@mui/material/Select';

const vscode = acquireVsCodeApi();

console.log('Sidebar App Loaded');

function App() {
  const [personName, setPersonName] = React.useState<string[]>([]);
  const [names, setNames] = React.useState<string[][]>([]);
  const [isButtonVisible, setIsButtonVisible] = React.useState(true); // State to control button visibility

  React.useEffect(() => {
    const messageListener = (event: MessageEvent) => {
      const message = event.data;
      if (message.type === 'displayExtensions') {
        const extensions = message.value;
        console.log('Received extensions:', extensions);
        setNames(extensions);
      }
    };

    window.addEventListener('message', messageListener);

    return () => {
      window.removeEventListener('message', messageListener);
    };
  }, []);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const { target: { value } } = event;
    const selectedValues = typeof value === 'string' ? value.split(',') : value;
    setPersonName(selectedValues);
    clickHandler(selectedValues);
  };

  function clickHandler(selectedExtensions: string[]) {
    const selectedPaths = names
      .filter((name) => selectedExtensions.includes(name[0]))
      .map((name) => name[1]);

    vscode.postMessage({ type: 'extensionSelected', value: selectedPaths });
  }

  const getExtensions = () => {
    vscode.postMessage({ type: 'getExtensions' });
    setIsButtonVisible(false); // Hide the button after clicking
  };

  const handleButtonClick = (name: string) => {
    console.log('Clicked button:', name);
    clickHandler([name]);
  };

  return (
    <Box sx={{ width: "40vw", m: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {isButtonVisible && (
        <Button variant="contained" color="primary" onClick={getExtensions}>Get Extensions</Button>
      )}
      <Box sx={{ width: "100%", mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {names.map((name) => (
          <Button
            key={name[0]}
            variant="outlined"
            sx={{ mb: 1, width: '100%' }}
            onClick={() => handleButtonClick(name[0])}
          >
            {name[0]}
          </Button>
        ))}
      </Box>
    </Box>
  );
}

export default App;
