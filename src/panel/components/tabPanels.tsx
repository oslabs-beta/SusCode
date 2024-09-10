import * as React from 'react';
import TabPanel from '@mui/lab/TabPanel';
import { scanResult } from '../../types';
import Results from './results';
import Box from '@mui/material/Box';
import ReadMeDiv from './readMeDiv';
import PatternInfo from './patternInfo';

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
      results: ['No potential network requests found.'],
    };

    return (
      <TabPanel value={value} key={getRandom()} id={content}>
        <ReadMeDiv readMe={readMe} extensionName={extensionName} />
        <Results
          patternMatchPanelResults={patternMatchPanel.results}
          telemetryMatchPanelResults={telemetryMatchPanel.results}
        />

        <PatternInfo patternNames={patternNames} />
      </TabPanel>
    );
  });

  return <Box>{tabPanels}</Box>;
}
module.exports = TabPanels;
