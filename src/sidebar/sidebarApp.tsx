import * as React from 'react';
// import * as vscode from 'vscode';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
// import Stack from '@mui/material/Stack';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const vscode = acquireVsCodeApi();

function App() {
  const [personName, setPersonName] = React.useState<string[]>([]);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  //maybe populate this on domload using useState?
  const names: string[][] = [];

  // let displayName = '';
  window.addEventListener('message', (event) => {
    const message = event.data; // The json data that the extension sent
    switch (message.type) {
      case 'displayExtensions': {
        console.log('received message from sidebar in extension.ts');
        const extensions = message.value;
        extensions.forEach((extension: string[]) => {
          names.push(extension);
        });
        setPersonName(extensions);
      }
    }
  });

  // function grabExtensions() {
  //   // vscode.panel.webview.postMessage({ type: 'getExtensions' });
  //   vscode.commands.executeCommand('suscode.displayExtensions')
  // }
  function clickHandler(extensionPath: any) {
    vscode.postMessage({ type: 'extensionSelected', value: extensionPath });
  }

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
    clickHandler(personName);
    return;
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id='demo-multiple-checkbox-label'>
          Select Extensions
        </InputLabel>
        <Select
          labelId='demo-multiple-checkbox-label'
          id='demo-multiple-checkbox'
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label='Tag' />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name[0]} value={name[0]}>
              <Checkbox checked={personName.indexOf(name[0]) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default App;

// const nonce = getNonce();

// function App() {
//   // const vscode = acquireVsCodeApi();

//   window.addEventListener('message', (event) => {
//     const message = event.data; // The json data that the extension sent
//     switch (message.type) {
//       case 'displayExtensions': {
//         function displayExtensions(extensions) {
//           const exButtons = document.querySelector('.extensions-list');

//           for (const extension of extensions) {
//             const exButton = document.createElement('button');
//             exButton.className = 'extensionButton';
//             exButton.innerText = extension[0];
//             exButton.addEventListener('click', (e) => {
//               clickHandler(extension[1]);
//             });
//             exButtons.appendChild(exButton);
//           }
//         }
//         displayExtensions(message.value);
//       }
//     }
//   });

//   function showExtensions() {
//     vscode.postMessage({ type: 'getExtensions' });
//   }
//   function clickHandler(extensionPath) {
//     vscode.postMessage({ type: 'extensionSelected', value: extensionPath });
//   }
//   return (
//     <div>
//       <Button variant='outlined' onClick={() => showExtensions()}>
//         Outlined
//       </Button>
//       <Accordion>
//         <AccordionSummary
//           expandIcon={<ExpandMoreIcon />}
//           aria-controls='panel1-content'
//           id='panel1-header'
//         >
//           Accordion 1
//         </AccordionSummary>
//         <AccordionDetails>First option</AccordionDetails>
//       </Accordion>
//       <Accordion>
//         <AccordionSummary
//           expandIcon={<ExpandMoreIcon />}
//           aria-controls='panel2-content'
//           id='panel2-header'
//         >
//           Accordion 2
//         </AccordionSummary>
//         <AccordionDetails>Second option</AccordionDetails>
//       </Accordion>
//       <Accordion defaultExpanded>
//         <AccordionSummary
//           expandIcon={<ExpandMoreIcon />}
//           aria-controls='panel3-content'
//           id='panel3-header'
//         >
//           Accordion Actions
//         </AccordionSummary>
//         <AccordionDetails>Third option</AccordionDetails>
//         <AccordionActions>
//           <Button>Cancel</Button>
//           <Button>Agree</Button>
//         </AccordionActions>
//       </Accordion>
//     </div>
//   );
// }
// export default App;
