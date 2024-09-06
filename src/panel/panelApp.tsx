import * as React from 'react';
import * as vscode from 'vscode';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

function App() {
  // initialize state for the read me description
  const [readMe, setReadMe] = useState<string>('');
  const [displayNames, setDisplayNames] = useState<string[]>([
    'name1',
    'name2',
    'name3',
  ]);
  const [value, setValue] = useState<number>(0);
  const [panelState, setPanelState] = useState<panelCache>({});

  interface scanResult {
    filepath?: string;
    results?: string[];
  }

  interface panelCache {
    [displayName: string]: scanResult;
  }
  const extensionScanObj: panelCache = {};

  React.useEffect(() => {
    const messageListener = (event: MessageEvent) => {
      const message = event.data;
      if (message.type === 'selectedExtensionNames') {
        const extensions = message.value;
        console.log('Received extension displayNames:', extensions);
        setDisplayNames(extensions);
        console.log('displayNames state after setting it ', displayNames);
        displayNames.forEach((displayName) => {
          extensionScanObj[displayName] = {};
        });
        setPanelState(extensionScanObj);
        console.log(
          'panelState after adding display names as object keys: ',
          panelState
        );
      }
    };

    window.addEventListener('message', messageListener);

    return () => {
      window.removeEventListener('message', messageListener);
    };
  }, []);

  //====================   LISTENING FOR MESSAGES FROM findReadMe() WITHIN findReadMe.ts   =================================//
  //assigning the data sent to the semantic variable message
  //if the message type is 'readMe', we invoke the setReadMe function with the 'value' which is the filepath for an extension

  window.addEventListener('message', (event) => {
    const message = event.data;
    switch (message.type) {
      case 'readMe': {
        setReadMe(message.value);
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
  const resultObj: scanResult = { filepath: extensionPath };

  window.addEventListener('message', (event) => {
    const message = event.data;

    const contentDiv: any = document.getElementById(
      `panelFor${message.fileName}`
      // 'content'
    );

    switch (message.type) {
      case 'update': {
        contentDiv.innerHTML += '<p>' + message.text + '</p>';
        break;
      }
      case 'end': {
        console.log('names after end, should be fileName', names);
        console.log('filename', message.fileName);
        contentDiv.innerHTML +=
          '<hr/><strong>Finished reading ' +
          message.fileName +
          '</strong><hr/>';
        break;
      }
      case 'error': {
        contentDiv.innerHTML +=
          '<p style="color:red;">' + message.text + '</p>';
        break;
      }
    }
  });
  let values = ['0', '1', '2'];

  let exNames = Object.keys(panelState);
  console.log('exNames', exNames);

  const tabs = names.map((extensionName, i) => {
    return <Tab label={extensionName} value={values[i]} />;
  });

  const tabPanels = names.map((extensionName, i: number) => {
    let content = `panelFor${extensionName}`;
    return (
      <TabPanel value={i.toString()}>
        Scan results for: {extensionName}
        <div id={content}></div>
      </TabPanel>
    );
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label='lab API tabs example'>
            {tabs}
          </TabList>
        </Box>
        {tabPanels}
        <TabPanel value='0'>Item One</TabPanel>
        <TabPanel value='1'>Item Two</TabPanel>
        <TabPanel value='2'>Item Three</TabPanel>
      </TabContext>
    </Box>
  );
}

export default App;

// useEffect(() => {
//   const extensionScanObj: panelCache = {};
//   const extensions = vscode.extensions.all.filter(
//     (extension) => !extension.id.startsWith('vscode.')
//   );
//   const extensionsList = extensions.forEach((extensionObj) => {
//     let displayName: string = extensionObj.packageJSON.displayName;
//     let extensionPath = JSON.stringify(extensionObj.extensionUri.path);
//     const resultObj: scanResult = { filepath: extensionPath };
//     extensionScanObj[displayName] = resultObj;
//     return;
//   });

//   console.log('extensionCanObj within useEffect', extensionScanObj);
//   setPanelState(extensionScanObj);
//   console.log('panelState within useEffect', panelState);
//   return;
// }, []);
