import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import Tabs from './tabs';
import TabPanels from './tabPanels';

//=================TabContextDive COMPONENT==========================//
// * This is the container for the Tabs and TabPanels
// * Tabs are generated dynamically by the generateTabs function in /components/tabs
// * TabPanels are generated dynamically by the generateTabPanels function in /components/tabPanels

export default function TabContextDiv(props: any) {
  const [value, setValue] = useState<number>(0);
  const { displayNames, panelState, readMe } = props;

  return (
    <TabContext value={value}>
      <Box
        sx={{
          borderBottom: 2,
          borderColor: 'divider',
          bgcolor: 'inherit',
          width: 500,
        }}
      >
        <Tabs displayNames={displayNames} setValue={setValue} />
      </Box>
      <TabPanels
        displayNames={displayNames}
        panelState={panelState}
        readMe={readMe}
      />
    </TabContext>
  );
}

module.exports = TabContextDiv;
