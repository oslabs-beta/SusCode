import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import Tabs from './tabs';
import TabPanels from './tabPanels';
import { Button } from '@mui/material';

//=================TabContextDive COMPONENT==========================//
// * This is the container for the Tabs and TabPanels
// * Tabs are generated dynamically by the generateTabs function in /components/tabs
// * TabPanels are generated dynamically by the generateTabPanels function in /components/tabPanels

export default function TabContextDiv(props: any) {
  const [value, setValue] = useState<number>(0);
  const [modalOpen, setModelOpen] = useState(false);
  const { displayNames, patternMatchPanelState, telemetryPanelState, readMe, virusTotal, setVirusTotal } =
    props;

  return (
    <TabContext value={value}>
      <Box
        sx={{
          borderBottom: 2,
          borderColor: 'divider',
          bgcolor: 'inherit',
          width: 'auto',
        }}
      >
        <Tabs displayNames={displayNames} setValue={setValue} />
      </Box>
      <TabPanels
        displayNames={displayNames}
        patternMatchPanelState={patternMatchPanelState}
        telemetryPanelState={telemetryPanelState}
        //////////////////add virus total state
        virsuTotal={virusTotal} /////<----'
        setVirusTotal={setVirusTotal}
        readMe={readMe}
        modalOpen={modalOpen}
        setModelOpen={setModelOpen}
      />
    </TabContext>
  );
}

module.exports = TabContextDiv;
