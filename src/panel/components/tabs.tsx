import * as React from 'react';
import { useState } from 'react';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';

//=================TabContextDive COMPONENT==========================//
// * This is the container for the Tabs and TabPanels
// * Tabs are generated dynamically by the generateTabs function in /components/tabs
// * TabPanels are generated dynamically by the generateTabPanels function in /components/tabPanels

export default function Tabs(props: any) {
  const { displayNames, setValue } = props;

  function getRandom() {
    return Math.random() * 100;
  }

  const tabs = displayNames.map((extensionName: string, i: number) => {
    let value = i.toString();
    return (
      <Tab
        label={extensionName}
        value={value}
        key={getRandom()}
        sx={{ color: 'rgb(191 182 182 / 60%)' }}
      />
    );
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <TabList
      variant='scrollable'
      scrollButtons='auto'
      onChange={handleChange}
      aria-label='lab API tabs example'
    >
      {tabs}
    </TabList>
  );
}

module.exports = Tabs;
