import * as React from 'react';
import TabPanel from '@mui/lab/TabPanel';
import { scanResult } from '../../types';
// import Results from './results';
import Box from '@mui/material/Box';
import ReadMeDiv from './readMeDiv';
import PatternInfo from './patternInfo';
import DependencyChecker from './dependencyChecker';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import PatternSearchResults from './searchResultComponents/patternSearchResults';
import TelemetrySearchResults from './searchResultComponents/telemetrySearchResults';
import VirusTotalHowToModal from './virusTotalHowToModal';
import Paper from '@mui/material/Paper';
// import virusTotalScan from '../workers/virusTotalScan'
import { useState, useEffect } from 'react';

const vscode = acquireVsCodeApi();

export default function TabPanels(props: any) {
  const [modalOpen, setModalOpen] = useState(false);
  const [ config, setConfig ] = useState(null);
  // const [loading, setLoading] = useState(false); // this is also stuff for virusTotal
  const { displayNames, patternMatchPanelState, telemetryPanelState, readMe, virusTotal, setVirusTotal } =
    props;

  //Below didn't work
  // useEffect(() => {
  //   const fetchConfig = async () => {
  //     const secretStorage = vscode.workspace.getConfiguration().getSecretStorage();
  //     const storedApiKey = await secretStorage.get('myExtension.apiKey');
  //     setConfig(storedApiKey);
  //   };
  //   fetchConfig();
  // }, []);



  //   below is the functionality to get the api key from secret storage but it's also in the virusTotalHowtoModal
  // async function getApiKey(){
  //   // const secretStorage = vscode.workspace.getConfiguration().getSecretStorage();
  //   // return await secretStorage.get('myExtension.apiKey');
  //   vscode.postMessage({command: 'getApiKey '});
  // }

  function getApiKey() {
    console.log('In the getApiKey function definition/ where it posts the message to extension.ts');
    vscode.postMessage({command: 'getApiKey'});
  }
  // I put the below functionality inside
  // window.addEventListener('message', (event) => {
  //   const message = event.data; // The message from the extension
  //   //Note for tomorrow. This is getting triggered on load a bunch of times for anytime a message is being sent. For example, it's console logging when patternmatchupdate and readme. Might need to add steps in extension.ts. My guess is there is one step/message being sent that I'm missing when I think about the findReadMe functionality
  //   console.log('This is message in message back from getApiKey:  ', message);
  //   if (message.value === undefined || message.value === null) {
  //     setModalOpen(true);
  //   }
  //   if (message.command === 'returnApiKey') {
  //     console.log('API Key:', message.value);

  //   }
  // });

  function getRandom() {
    return Math.random() * 100;
  }

  async function handleClicking () {
    // const apiKey = ''; //await getApiKey();
    // try {
    //   if (apiKey === undefined) {
        // await setModalOpen(true);
        window.addEventListener('message', (event) => {
          const message = event.data; // The message from the extension
          //Note for tomorrow. This is getting triggered on load a bunch of times for anytime a message is being sent. For example, it's console logging when patternmatchupdate and readme. Might need to add steps in extension.ts. My guess is there is one step/message being sent that I'm missing when I think about the findReadMe functionality
          console.log('This is message in message back from getApiKey:  ', message);
          if (message.value === undefined || message.value === null) {
            setModalOpen(true);
          }
          if (message.command === 'returnApiKey') {
            console.log('API Key:', message.value);
      
          }
        });
        console.log('checking if the modal is open: ', modalOpen);
        getApiKey();
        // HorizontalLinearAlternativeLabelStepper();
    //     console.log(modalOpen);
    //   }
    //   else {
    //     console.log('apparently have an apikey? could not be');
    //     // setLoading(true)
    //     // virusTotalScan(apiKey)
    //     //run scan to return div? 
    //     // add loading thing
    //     // setVirusTotal - //run scan essentially
    //   }
    // }
    // catch (error) {
    //     console.error('Flippin! Error running scan:', error);
    // }
  }
  
  const tabPanels = displayNames.map((extensionName: string, i: number) => {
    let value = i.toString();
    let content = `panelFor${extensionName}`;
    const patternMatchPanel: scanResult = patternMatchPanelState[
      extensionName
    ] || {
      results: [{ funcName: 'no results yet', count: 0 }],
    };
    const patternNames: any = patternMatchPanel.results.map((resultsObject) => {
      return resultsObject.name;
    }) || ['no patternNames yet'];
    const telemetryMatchPanel: scanResult = telemetryPanelState[
      extensionName
    ] || {
      results: [],
    };

    return (
      <TabPanel value={value} key={getRandom()} id={content}>
        <ReadMeDiv readMe={readMe} extensionName={extensionName} />
               
        {/* <Results
          patternMatchPanelResults={patternMatchPanel.results}
          telemetryMatchPanelResults={telemetryMatchPanel.results}
        /> */}

        <Divider sx={{ marginTop: '8px', marginBottom: '8px' }}>
          <Chip label='PATTERNS FOUND' variant='outlined' color='primary' />
        </Divider>
        <Paper
          style={{
            maxHeight: 300,
            overflow: 'auto',
            background: 'inherit',
          }}
          elevation={4}
        >
          <PatternSearchResults results={patternMatchPanel.results} />
        </Paper>


        <Divider sx={{ marginTop: '8px', marginBottom: '8px' }}>
          <Chip
            label='INFORMATION ON FOUND PATTERNS'
            variant='outlined'
            color='primary'
          />
        </Divider>
        <Paper
          style={{
            maxHeight: 300,
            overflow: 'auto',
            background: 'inherit',
          }}
          elevation={4}
        >
        <PatternInfo patternNames={patternNames} />
        </Paper>

        <Divider sx={{ marginTop: '8px', marginBottom: '8px' }}>
          <Chip
            label='POTENTIAL TELEMETRY INTERACTIONS'
            variant='outlined'
            color='primary'
          />
        </Divider>
        <Paper
          style={{
            maxHeight: 300,
            overflow: 'auto',
            background: 'inherit',
          }}
          elevation={4}
        >
          <TelemetrySearchResults results={telemetryMatchPanel.results} />
        </Paper>


        <Divider sx={{ marginTop: '8px', marginBottom: '8px' }}>
          <Chip label='DEPENDENCIES FOUND' variant='outlined' color='primary' />
        </Divider>
        <Paper
          style={{
            maxHeight: 300,
            overflow: 'auto',
            background: 'inherit',
          }}
          elevation={4}
        >
        <DependencyChecker depResults={patternMatchPanel.depVulns} />
        </Paper>
        <Box>
          
        <Box sx={{
                    height: "150px",
                    width: "150px",              
                    mt: "30px",
                }}>
        <Button variant="contained" id='virusScanBtn' onClick={() => {
          console.log('the button got clicked');
          // setModalOpen(true);
          handleClicking();          
        }} >Run VirusTotal Scan</Button>
        </Box>
        <Paper>       
           <VirusTotalHowToModal modalOpen={modalOpen} setModalOpen={setModalOpen} vscode={vscode} />
           Hey  why isn't this working
        </Paper>
        {/* {loading && <Box>Running Scan</Box> }
        { virusTotal && <Box>
          go through virusTotal result to display each scan ran and results
        </Box> } */}
        </Box>
      </TabPanel>
    );
  });
  return <Box>{tabPanels}</Box>;
}
module.exports = TabPanels;
