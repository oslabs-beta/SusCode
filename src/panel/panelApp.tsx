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
  // Adding unique state for each search that appears in a panel for an app
  const [patternMatchPanelState, setPatternMatchPanelState] = useState<panelCache>({});
  const [telemetryPanelState, setTelemetryPanelState] = useState<panelCache>({});

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
        let updatedReadMeState = Object.assign(currentReadMeObj, message.value);
        setReadMe(updatedReadMeState);
        break;
      }
    }
  });

  //====================   LISTENING FOR MESSAGES FROM streamFilesInDirectory() WITHIN fileReader.ts   =====================//
  //grabbing html element with id: 'content'
  //assigning the data sent to the semantic variable message
  //providing multiple outcomes depending on the "type" of the message that was sent
  //if the message type is 'patternMatchUpdate' we add a p tag to display the text which is all the occurence of found patterns
  //if the message type is 'patternMatchEnd' we add a line, a bolded declaration that the file is finished reading, and another line
  //if the message type is 'error' we display a p tag of red text delcaring the file name and error message
  let patternMatchExtensionObj: panelCache | undefined = patternMatchPanelState;
  window.addEventListener('message', (event) => {
    const message = event.data;
    let disName = message.displayName;

    switch (message.type) {
      // Does this skip the first result that comes in?
      case 'patternMatchUpdate': {
        let funcName = message.text.name;
        let count = message.text.count;

        if (!patternMatchExtensionObj[disName]) {
          patternMatchExtensionObj[disName] = { filepath: [], results: [] };
        } else {
          const currentExResArray: resultsObj[] | undefined = patternMatchExtensionObj[disName].results;
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
        break;
      }

      case 'patternMatchEnd': {
        patternMatchExtensionObj[disName].filepath.push(message.fileName);
        setPatternMatchPanelState(patternMatchExtensionObj);
        break;
      }
      case 'dependencyCheck': {
        console.log('depCheck', message);
        patternMatchExtensionObj[message.displayName].depVulns = message.depVulns;
        break;
      }
      case 'error': {
        //display error somehow, it is stored as message.text
        break;
      }
    }
  });

    // Repeating this for ease of implementation
  //====================   LISTENING FOR MESSAGES FROM analyzeFilesForNetworkRequests() WITHIN fileReader.ts   =====================//
  //grabbing html element with id: 'content'
  //assigning the data sent to the semantic variable message
  //providing multiple outcomes depending on the "type" of the message that was sent
  //if the message type is 'telemetryMatchUpdate' we add a p tag to display the text which is just potential telemetry content
  //if the message type is 'error' we display a p tag of red text delcaring the file name and error message

  let telemetryExtensionObj: panelCache | undefined = telemetryPanelState;
  window.addEventListener('message', (event) => {
    console.log('content inside telemetryaddEventListener', event)
    const message = event.data;
    let disName = message.displayName;

    switch (message.type) {

      // This may be overwriting results as they come in
      case 'telemetryMatchUpdate': {

        // this is the data that comes in from networkRequestFinder
        console.log('content inside telemetryMatchUpdate', message.resultObjArr)
    
        // Here we're trying to build up what will be the state object that's associated with 
        // holding the telemetry data
        if (!telemetryExtensionObj[disName]) {
          telemetryExtensionObj[disName] = { filepath: [], results: [] };
        }
        

        // At this point in time the results are coming in as an array of objects- I will
        // keep it as such so that the state can rerender the array of values
        telemetryExtensionObj[disName].filepath.push(message.fileName);
        telemetryExtensionObj[disName].results.push(...message.resultObjArr);

        console.log('setting the telepanel state', telemetryExtensionObj);
        setTelemetryPanelState(telemetryExtensionObj);
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
        patternMatchPanelState={patternMatchPanelState}
        telemetryPanelState={telemetryPanelState}
        readMe={readMe}
      />
    </Box>
  );
}

export default App;
