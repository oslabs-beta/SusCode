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
import VirusTotalResults from './searchResultComponents/virusTotalSearchResults';
import Paper from '@mui/material/Paper';
import { virusTotalScan } from '../../workers/virusTotalScan';
import { useState, useEffect, FormEvent } from 'react';
import {  AnalysisResponse } from '../../types';
// import { Input } from '@mui/material';

const vscode = acquireVsCodeApi();

export default function TabPanels(props: any) {
  const [modalOpen, setModalOpen] = useState(false);
  const [ keyError, setKeyError ] = useState(false);
  const [clicked, setClicked] = useState(false);

  type VirusTotalState = {
    [extensionName:string]: {[filename: string]: AnalysisResponse['data']['attributes']['results']};
  }; 
  const [virusTotal, setVirusTotal] = useState<VirusTotalState>({});

  const [loading, setLoading] = useState(false); // this is also stuff for virusTotal
  const { displayNames, patternMatchPanelState, telemetryPanelState, readMe} =
    props;

  async function  handleClicking (extensionName: string) {       
    console.log('checking if the modal is open: ', modalOpen);
    console.log('here is the extension name hopefully within the handleClicking: ', extensionName);
    getApiKey(extensionName);
  }
  function getApiKey(extensionName: string) {
    console.log('In the getApiKey function definition/ where it posts the message to extension.ts');
    vscode.postMessage({type: 'getApiKey', extensionName: extensionName});
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
 
  // window.addEventListener('message', (event) => {
  //   const message = event.data; // The message from the extension
  //   //Note for tomorrow. This is getting triggered on load a bunch of times for anytime a message is being sent. For example, it's console logging when patternmatchupdate and readme. Might need to add steps in extension.ts. My guess is there is one step/message being sent that I'm missing when I think about the findReadMe functionality
  //   console.log('This is message in message back from getApiKey:  ', message);
  //   if (message.value === undefined || message.value === null) {
  //     setModalOpen(true);
  //   }
  //   if (message.command === 'returnApiKey') {
  //     console.log('API Key in eventlistener in handle click :', message.value);
  //   }
  // });

  //adding this listener just to make sure certain (modalOpen) messages are being recieved
  // window.addEventListener('message', (event) => {
  //   console.log('Global message listener received:', event.data);
  // });

  useEffect(() => {
    const handleMessage = (event: any) => {
      const message = event.data;
      // console.log('message recieved in useEffect: ', message);
      switch (message.type){
        case 'returnApiKey' : 
          if (message.value) {
            const { value: apiKey, extensionName } = message; // Destructure extensionName from message
            try {
              
              console.log('API Key received:', message.value);
              vscode.postMessage({ type: 'runVirusTotalScan', value: apiKey, extensionName: extensionName,
                //  func: setModalOpen
                });
                setModalOpen(true);
              // virusTotalScan(apiKey, extensionName);
              console.log('the extensionName parameter in the try of useEffect:  ', extensionName);
            }
            catch(error) {
              setModalOpen(true);
            }
          }
          else {
            setModalOpen(true);
          }
          break;

        case 'keyError':
          console.log('Error with API key');
          setKeyError(true);
          break;
        
        case 'keyIsGood':
          console.log('Key checks out');
          setKeyError(false);
          break;

        case 'vtResultsLoading':
          console.log('loading');
          if(keyError === false){
            message.value.forEach((el: string) => {
              setVirusTotal((prevState: any) => ({
                ...prevState,
                [message.extName]: {
                  ...prevState[message.extName], 
                  [el]: 'loading',
                },
              }));
            });
            setLoading(true);
          }
          break;

        case 'vtResults':
          console.log('This is the results back in tabPanels ->  File Name: ' + message.filename);
          console.log('this is the extName that is being passed:  ', message.extName);
          console.log(message.value);
          setLoading(false);
          setVirusTotal((prevState) => ({
            ...prevState,
            [message.extName]: {
              ...prevState[message.extName],
              [message.filename]: message.value,
            },
          }));
          break;

        case 'modalOpen':
          console.log('back in tabPanels in useEffect handleessage and recieved modalOpen message.');
          setModalOpen(true);
          break;
    }  
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  
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
                    // height: "150px",
                    width: "150px",              
                    mt: "30px",
                    marginBottom: '-3px',
                    // bgcolor: "purple"
                }}>
        <Button sx={{
          bgcolor: clicked ? '#3D3D3D' : '#97D8C4', color: clicked ? '#b3b3b5' : 'black', boxShadow: clicked ? 'none' : 1, width: '220px','&:hover': {
          bgcolor: '#1F6F66',
          color: '#cccccc', 
          },
        }} variant="contained" id='virusScanBtn' onClick={() => {
          console.log('the button got clicked');
          setClicked(true);
          // setModalOpen(true);
          handleClicking(extensionName);          
        }} >Run VirusTotal Scan</Button>
        </Box>
        <Paper sx={{marginTop: 0, paddingTop: 0, marginBottom: 0}} >       
           <VirusTotalHowToModal modalOpen={modalOpen} setModalOpen={setModalOpen} vscode={vscode} extensionName={extensionName} />
           <VirusTotalResults keyError={keyError} modalOpen={modalOpen} VTResults={virusTotal[extensionName] || {}} loading={loading} />
        </Paper>
        <Box sx={{height: '200px'}}></Box>
        </Box>
      </TabPanel>
    );
  });
  return <Box>{tabPanels}</Box>;
}
module.exports = TabPanels;
