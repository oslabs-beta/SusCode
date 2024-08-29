import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { SelectChangeEvent } from '@mui/material/Select';
//import the evalScanFunction from the file (get this from Will)
import findReadMe from '../findReadMe';

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
    const {
      target: { value },
    } = event;
    const selectedValues = typeof value === 'string' ? value.split(',') : value;
    setPersonName(selectedValues);
    console.log(selectedValues);
    // clickHandler(selectedValues);
  };

  function clickHandler(selectedExtensions: string[]) {
    const selectedPaths = names
      .filter((name) => selectedExtensions.includes(name[0]))
      .map((name) => name[1]);
    console.log('selectedPaths in clickHandler', selectedPaths);
    // findReadMe(
    //   selectedPaths[0],
    //   (err: string | null, description: string | null) => {
    //     if (err) {
    //       console.error('Error: ', err);
    //     } else {
    //       console.log('made it back to findReadMe invocation: ', description);
    //       vscode.postMessage({
    //         type: 'readMe',
    //         value: description,
    //       });
    //       //can't return out so functionality(sending to front) must be done here
    //     }
    //   }
    // );
    // invoke evalScanFunction(selectedPaths);
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
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isButtonVisible && (
        <button
          style={{
            backgroundColor: '#007BFF',
            color: '#FFF',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onClick={getExtensions}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = '#0056b3')
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = '#007BFF')
          }
        >
          Get Extensions
        </button>
      )}
      <Box
        sx={{
          width: '100%',
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {names.map((name) => (
          <button
            key={name[0]}
            style={{
              backgroundColor: '#007BFF',
              color: '#FFF',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginBottom: '10px',
              width: '100%',
              transition: 'background-color 0.3s ease',
            }}
            onClick={() => handleButtonClick(name[0])}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = '#0056b3')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = '#007BFF')
            }
          >
            {name[0]}
          </button>
        ))}
      </Box>
    </Box>
  );
}

export default App;
