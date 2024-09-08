import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import generateTabPanels from './tabPanels';
import generateTabs from './tabs';

//=================TabContextDive COMPONENT==========================//
// * This is the container for the Tabs and TabPanels
// * Tabs are generated dynamically by the generateTabs function in /components/tabs
// * TabPanels are generated dynamically by the generateTabPanels function in /components/tabPanels

export default function TabContextDiv(props: any) {
  const [value, setValue] = useState<number>(0);
  const { displayNames, panelState } = props;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange} aria-label='lab API tabs example'>
          {generateTabs(displayNames)}
        </TabList>
      </Box>
      {generateTabPanels(displayNames, panelState)}
    </TabContext>
  );
}

module.exports = TabContextDiv;
