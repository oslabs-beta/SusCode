import * as React from 'react';
import * as vscode from 'vscode';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import NavBar from './navBar';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';

// function updatePanelState(state, props){
//   return { }
// }

function App() {
  // initialize state for the read me description
  const [loading, setLoading] = useState<boolean>(true);
  const [readMe, setReadMe] = useState<string>('');
  const [displayNames, setDisplayNames] = useState<string[]>([]);
  const [value, setValue] = useState<number>(0);
  const [panelState, setPanelState] = useState<panelCache>({});

  interface scanResult {
    filepath?: string;
    results?: string[];
  }
  let scanResultObj: scanResult = {
    filepath: '',
    results: [],
  };
  interface panelCache {
    [displayName: string]: scanResult;
  }
  const extensionScanObj: panelCache = {};

  //====================   LISTENING FOR MESSAGES FROM findReadMe() WITHIN findReadMe.ts   =================================//
  //assigning the data sent to the semantic variable message
  //if the message type is 'readMe', we invoke the setReadMe function with the 'value' which is the filepath for an extension

  window.addEventListener('message', (event) => {
    const message = event.data;
    switch (message.type) {
      case 'selectedExtensionNames': {
        const extensions: string[] = message.value;
        // console.log('Received extension displayNames:', extensions);
        // setDisplayNames((state): string[] => state.concat(extensions));
        setDisplayNames(extensions);
        // console.log('displayNames state after setting it ', displayNames);
        extensions.forEach((displayName) => {
          // console.log('within displayNames forEach :', displayName);
          extensionScanObj[displayName] = scanResultObj;
          // console.log(
          //   'extensionScanObj within displayNames forEach:',
          //   extensionScanObj
          // );
        });
        setPanelState(extensionScanObj);
        // setPanelState((state) => Object.assign({}, state, extensionScanObj));

        console.log(
          'setting panelState to extensionScanObj which is: ',
          extensionScanObj
        );
        break;
      }

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

  window.addEventListener('message', (event) => {
    const message = event.data;
    let extensionObj: panelCache = panelState;
    let disName: string = displayNames[0] || 'displayNames not set yet';

    switch (message.type) {
      case 'update': {
        setLoading(true);
        if (!extensionObj[disName]) {
          extensionObj[disName] = { filepath: '', results: [] };
        }
        extensionObj[disName].results?.push(message.text);
        break;
      }
      case 'end': {
        extensionObj[disName].filepath = message.fileName;
        // setPanelState((state) => Object.assign({}, state, extensionObj));
        setPanelState(extensionObj);
        console.log('end, showing panelState: ', panelState);
        console.log('end, showing extensionObj', extensionObj);
        setLoading(false);
        break;
      }
      case 'error': {
        // contentDiv.innerHTML +=
        //   '<p style="color:red;">' + message.text + '</p>';
        break;
      }
    }
  });

  const tabs = displayNames.map((extensionName, i) => {
    return <Tab label={extensionName} value={i.toString()} />;
  });

  const tabPanels = displayNames.map((extensionName, i: number) => {
    let content = `panelFor${extensionName}`;
    const panel = panelState[extensionName] || { results: [] }; // guard clause

    return (
      <TabPanel value={i.toString()}>
        Scan results for: {extensionName}
        <Typography id={content}>
          {panel.results?.join(', ') || 'No results yet.'}
        </Typography>
      </TabPanel>
    );
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <NavBar />
      <Grid container wrap='nowrap'>
        {loading === false ? (
          <TabContext value={value}>
            <Skeleton />
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList
                onChange={handleChange}
                aria-label='lab API tabs example'
              >
                {tabs}
              </TabList>
            </Box>
            {tabPanels}
          </TabContext>
        ) : (
          <Box sx={{ pt: 0.5 }}>
            <Skeleton variant='rectangular' width={210} height={118} />
            <Skeleton />
            <Skeleton width='60%' />
          </Box>
        )}
      </Grid>
      <Box>
        <Typography> {readMe}</Typography>
      </Box>
    </Box>
  );
}

export default App;

// let extensionObj: any = {};

//         let currentEx: string[] = displayNames.filter((displayName) => {
//           let filepath = message.fileName.toLowerCase();
//           let lowDisplayName = displayName.toLowerCase();
//           return filepath.includes(lowDisplayName);
//         });
//         if (!extensionObj[currentEx[0]]) {
//           const resultObj: scanResult = {
//             filepath: message.fileName,
//             results: message.text,
//           };
//           extensionObj[currentEx[0]] = resultObj;
//         } else if (extensionObj[currentEx[0]].results) {
//           extensionObj[currentEx[0]].results.push(message.text);
//         }
//         // contentDiv.innerHTML += '<p>' + message.text + '</p>';
//         setPanelState(extensionObj);
//         setPanelState(Object.assign({}, panelState, extensionObj));
//         // console.log(extensionObj);
