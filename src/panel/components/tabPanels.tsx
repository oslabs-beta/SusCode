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

import PatternSearchResults from './searchResultComponents/patternSearchResults';
import TelemetrySearchResults from './searchResultComponents/telemetrySearchResults';
import Paper from '@mui/material/Paper';

export default function TabPanels(props: any) {
  const { displayNames, patternMatchPanelState, telemetryPanelState, readMe } =
    props;

  function getRandom() {
    return Math.random() * 100;
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
      </TabPanel>
    );
  });

  return <Box>{tabPanels}</Box>;
}
module.exports = TabPanels;
