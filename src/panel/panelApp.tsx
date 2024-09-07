import * as React from 'react';
import * as vscode from 'vscode';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import NavBar from './components/navBar';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LibraryBooksSharpIcon from '@mui/icons-material/LibraryBooksSharp';
import Icon from '@mui/material';

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
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  function getRandom() {
    return Math.random() * 100;
  }

  interface resultsObj {
    [key: string]: number;
  }
  //can these types be defined elsewhere and imported?
  interface scanResult {
    filepath?: string;
    results: resultsObj[];
  }

  interface panelCache {
    [displayName: string]: scanResult;
  }

  let scanResultObj: scanResult = {
    filepath: '',
    results: [],
  };

  const extensionScanObj: panelCache = {};
  let isInitialized = false;

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
        isInitialized = true;
        setDisplayNames(extensions);
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
  // if (isInitialized && displayNames.length > 0) {
  let extensionObj: panelCache | undefined = panelState;
  window.addEventListener('message', (event) => {
    const message = event.data;
    console.log('within mesage received, displayNames state:', displayNames);
    //let disName = message.name
    let disName: string = displayNamesArray[2];

    switch (message.type) {
      case 'update': {
        let funcName = message.text.name;
        let count = message.text.count;

        setLoading(true);
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
        break;
      }
      case 'end': {
        extensionObj[disName].filepath = message.fileName;
        setPanelState(extensionObj);
        console.log('end, showing extensionObj', extensionObj);
        setLoading(false);
        break;
      }
      case 'error': {
        //display error somehow, it is stored as message.text
        break;
      }
    }
  });
  // }
  function generateTabs() {
    const tabs = displayNames.map((extensionName, i: number) => {
      let value = i.toString();
      return <Tab label={extensionName} value={value} key={getRandom()} />;
    });
    console.log('tabs: ', tabs);
    return tabs;
  }

  function generateTabPanels() {
    const tabPanels = displayNames.map((extensionName, i: number) => {
      let value = i.toString();
      let content = `panelFor${extensionName}`;
      console.log('making tabPanel for :', extensionName);
      const panel = panelState[extensionName] || {
        results: [{ funcName: 'no results yet', count: 0 }],
      };

      const scanResults = function () {};
      const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

      function gainedResult(array: resultsObj[]): React.ReactNode[] {
        console.log('array within gainedResult: ', array);
        const panelResults: React.ReactNode[] = array.map((funcObj) => {
          return (
            <div>
              {funcObj.name} was found {funcObj.count} times
            </div>
          );
        });
        return panelResults;
      }

      return (
        <TabPanel value={value} key={getRandom()}>
          {gainedResult(panel.results)}
          <div>
            <IconButton onClick={handleOpen}>
              <Tooltip title='Learn about this Extension' placement='left-end'>
                <LibraryBooksSharpIcon />
              </Tooltip>
            </IconButton>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby='modal-modal-title'
              aria-describedby='modal-modal-description'
            >
              <Box sx={style}>
                <Typography id='modal-modal-title' variant='h6' component='h2'>
                  Extension Description for Quokka
                </Typography>
                <Typography id='modal-modal-description' sx={{ mt: 2 }}>
                  ReadMe Description will go here
                </Typography>
              </Box>
            </Modal>
          </div>
        </TabPanel>
      );
    });
    console.log('tabpanels', tabPanels);
    return tabPanels;
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <NavBar />
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label='lab API tabs example'>
            {generateTabs()}
          </TabList>
        </Box>
        {generateTabPanels()}
      </TabContext>
      <Box>
        <Typography> {readMe}</Typography>
      </Box>
    </Box>
  );
}

export default App;
