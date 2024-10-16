import * as React from 'react';
import TabPanel from '@mui/lab/TabPanel';
import { scanResult } from '../../types';
import HorizontalLinearAlternativeLabelStepper from './virusTotalHowToModel';
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
import Paper from '@mui/material/Paper';
import virusTotalScan from '../workers/virusTotalScan'
import * as vscode from 'vscode'
import { useState } from 'react'

export default function TabPanels(props: any) {
  const [modalOpen, setModelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { displayNames, patternMatchPanelState, telemetryPanelState, readMe, virusTotal, setVirusTotal} =
    props;

  async function getApiKey(): Promise<string | undefined> {
    const secretStorage = vscode.workspace.getConfiguration().getSecretStorage();
    return await secretStorage.get('myExtension.apiKey');
  }

  function getRandom() {
    return Math.random() * 100;
  }
  async function handleClicking () {
    const apiKey = await getApiKey()
    try {
      if (!apiKey) {
        setModelOpen(true)
        // HorizontalLinearAlternativeLabelStepper();
      }
      else {
        setLoading(true)
        virusTotalScan(apiKey)
        //run scan to return div? 
        // add loading thing
        // setVirusTotal - //run scan essentially
      }
    }
    catch (error) {
        console.error('Flippin! Error running scan:', error)
    }
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
          
        {/* <Box sx={{
                    height: "150px",
                    width: "150px",              
                    mt: "30px",
                }}>
        <Button variant="contained" onClick={() => {
          console.log('the button got clicked');
          HorizontalLinearAlternativeLabelStepper(); //this might actually need to be a boolean to open the div...?
        }} >Run VirusTotal Scan</Button>
        </Box> */}
        {loading && <Box>Running Scan</Box> }
        { virusTotal && <Box>
          go through virusTotal result to display each scan ran and results
        </Box> }
        </Box>
      </TabPanel>
    );
  });

  return <Box>{tabPanels}</Box>;
}
module.exports = TabPanels;
