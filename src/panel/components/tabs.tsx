import * as React from 'react';
import Tab from '@mui/material/Tab';

export default function generateTabs(displayNames: string[]) {
  function getRandom() {
    return Math.random() * 100;
  }
  const tabs = displayNames.map((extensionName: string, i: number) => {
    let value = i.toString();
    return <Tab label={extensionName} value={value} key={getRandom()} />;
  });
  console.log('tabs: ', tabs);
  return tabs;
}

module.exports = generateTabs;
