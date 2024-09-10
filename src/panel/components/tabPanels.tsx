import * as React from 'react';
import TabPanel from '@mui/lab/TabPanel';
import { scanResult } from '../../types';
import Results from './results';
import Box from '@mui/material/Box';
import ReadMeDiv from './readMeDiv';
import DependencyChecker from './dependencyChecker';

export default function TabPanels(props: any) {
  const { displayNames, panelState, readMe } = props;

  function getRandom() {
    return Math.random() * 100;
  }

  const tabPanels = displayNames.map((extensionName: string, i: number) => {
    let value = i.toString();
    let content = `panelFor${extensionName}`;
    const panel: scanResult = panelState[extensionName] || {
      results: [{ funcName: 'no results yet', count: 0 }],
    };

    return (
      <TabPanel value={value} key={getRandom()} id={content}>
        <Results results={panel.results} />
        <ReadMeDiv readMe={readMe} extensionName={extensionName} />
        <DependencyChecker  depResults={panel.depVulns}/>
      </TabPanel>
    );
  });

  return <Box>{tabPanels}</Box>;
}
module.exports = TabPanels;
