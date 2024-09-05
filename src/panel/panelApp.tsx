import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

function App() {
  // initialize state for the read me description
  const [readMe, setReadMe] = useState<string>('');
  const [names, setNames] = useState<string[]>([
    'Liveshare',
    'quokka',
    'postman',
  ]);
  const [value, setValue] = useState<number>(0);

  //====================   LISTENING FOR MESSAGES FROM findReadMe() WITHIN findReadMe.ts   =================================//
  //assigning the data sent to the semantic variable message
  //if the message type is 'readMe', we invoke the setReadMe function with the 'value' which is the filepath for an extension

  window.addEventListener('message', (event) => {
    const message = event.data;
    switch (message.type) {
      case 'readMe': {
        setReadMe(message.value);
        break;
      }
    }
  });

  //====================   LISTENING FOR MESSAGES FROM streamFilesInDirectory() WITHIN fileReader.ts   =====================//
  //grabbing html element with id: 'content'
  //assigning the data sent to the semantic variable message
  //providing multiple outcomes depending on the "type" of the message that was sent
  //if the message type is 'update' we add a p tag to display the text which is all the occurence of found patterns
  //if the message type is 'end' we add a line, a bolded declaration that the file is finished reading, and another line
  //if the message type is 'error' we display a p tag of red text delcaring the file name and error message
  // window.addEventListener('message', (event) => {
  //   const message = event.data;
  //   const contentDiv: any = document.getElementById(
  //     `panelFor${message.fileName}`
  //   );
  //   // setNames(message.fileName);
  //   switch (message.type) {
  //     case 'update': {
  //       setNames(message.fileName);
  //       contentDiv.innerHTML += '<p>' + message.text + '</p>';
  //       break;
  //     }
  //     case 'end': {
  //       contentDiv.innerHTML +=
  //         '<hr/><strong>Finished reading ' +
  //         message.fileName +
  //         '</strong><hr/>';
  //       break;
  //     }
  //     case 'error': {
  //       contentDiv.innerHTML +=
  //         '<p style="color:red;">' + message.text + '</p>';
  //       break;
  //     }
  //   }
  // });
  let values = ['0', '1', '2'];
  const tabs = names.map((extensionName, i) => {
    return <Tab label={extensionName} value={values[i]} />;
  });

  // const tabPanels = names.map((extensionName, i: number) => {
  //   let content = `panelFor${extensionName}`;
  //   return (
  //     <TabPanel value={i.toString()} id={content}>
  //       Scan results for: {extensionName}
  //     </TabPanel>
  //   );
  // });

  // const tabPanelsFake = names.map((extensionName, i: number) => {
  //   return (
  //     <TabPanel value={i.toString()}>
  //       Scan results for: {extensionName}
  //       <Typography> eval() was found 53 times in extension.js</Typography>
  //     </TabPanel>
  //   );
  // });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label='lab API tabs example'>
            {tabs}
          </TabList>
        </Box>
        <TabPanel value='0'>Item One</TabPanel>
        <TabPanel value='1'>Item Two</TabPanel>
        <TabPanel value='2'>Item Three</TabPanel>
      </TabContext>
    </Box>
  );
}

export default App;
//        {tabPanelsFake}
// {tabPanels}
