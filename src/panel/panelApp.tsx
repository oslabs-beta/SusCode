import * as React from 'react';
import { useState } from 'react';
import { resultsObj, panelCache } from '../types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import NavBar from './components/navBar';
import TabContextDiv from './components/tabContext';

function App() {
  // initialize state for the read me description
  const [readMe, setReadMe] = useState<object>({});
  const [displayNames, setDisplayNames] = useState<string[]>([]);
  const [panelState, setPanelState] = useState<panelCache>({});

  let displayNamesArray: string[];

  //====================   LISTENING FOR MESSAGES FROM findReadMe() WITHIN findReadMe.ts   =================================//
  //assigning the data sent to the semantic variable message
  //if the message type is 'readMe', we invoke the setReadMe function with the 'value' which is the filepath for an extension

  window.addEventListener('message', (event) => {
    const message = event.data;
    switch (message.type) {
      case 'selectedExtensionNames': {
        const extensions: string[] = message.value;
        displayNamesArray = extensions;
        setDisplayNames(extensions);
        break;
      }
      case 'readMe': {
        //{ name: description}
        let currentReadMeObj = readMe;
        console.log(
          'received readMe in panelapp, this is message.value: ',
          message.value
        );
        let updatedReadMeState = Object.assign(currentReadMeObj, message.value);
        console.log(
          'updatedReadMeState after object.assign',
          updatedReadMeState
        );
        setReadMe(updatedReadMeState);
        break;
      }
    }
  });

  //====================   LISTENING FOR MESSAGES FROM streamFilesInDirectory() WITHIN fileReader.ts   =====================//
  //grabbing html element with id: 'content'
  //assigning the data sent to the semantic variable message
  //providing multiple outcomes depending on the "type" of the message that was sent
  //if the message type is 'update' we add a p tag to display the text which is all the occurence of found patterns
  //if the message type is 'end' we add a line, a bolded declaration that the file is finished reading, and another line
  //if the message type is 'error' we display a p tag of red text delcaring the file name and error message
  let nameSwitcher = true;
  let disName: string;
  let extensionObj: panelCache | undefined = panelState;
  window.addEventListener('message', (event) => {
    const message = event.data;
    // console.log('within mesage received, displayNames state:', displayNames);
    let disName = message.displayName;

    switch (message.type) {
      case 'update': {
        let funcName = message.text.name;
        let count = message.text.count;

        if (!extensionObj[disName]) {
          extensionObj[disName] = { filepath: '', results: [] };
        } else {
          const currentExResArray: resultsObj[] | undefined =
            extensionObj[disName].results;

          let objectValues = currentExResArray.map((obj) => {
            return obj.name;
          });
          if (!objectValues.includes(message.text.name)) {
            currentExResArray.push(message.text);
          } else {
            for (let obj of currentExResArray) {
              if (obj.name === funcName) {
                obj.count += count;
              }
            }
          }
        }
        nameSwitcher = !nameSwitcher;
        break;
      }
      case 'end': {
        extensionObj[disName].filepath = message.fileName;
        setPanelState(extensionObj);
        console.log('end, showing extensionObj', extensionObj);
        break;
      }
      case 'error': {
        //display error somehow, it is stored as message.text
        break;
      }
    }
  });

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <NavBar />
      <TabContextDiv
        displayNames={displayNames}
        panelState={panelState}
        readMe={readMe}
      />
    </Box>
  );
}

export default App;
