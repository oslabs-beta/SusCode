import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


function App() {
  // initialize state for the read me description
  const [readMe, setReadMe] = useState<string>('');

  //====================   LISTENING FOR MESSAGES FROM findReadMe() WITHIN findReadMe.ts   =================================//
  //assigning the data sent to the semantic variable message
  //if the message type is 'readMe', we invoke the setReadMe function with the 'value' which is the filepath for an extension

  window.addEventListener('message', (event: MessageEvent) => {
    
    const message = event.data;
    console.log('In the panelAppTSX in the addEventListener and here is the message sent to Ali: ', message.value);
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
  window.addEventListener('message', (event) => {
    const contentDiv: any = document.getElementById('content');
    const message = event.data;
    switch (message.type) {
      case 'update': {
        contentDiv.innerHTML += '<p>' + message.text + '</p>';
        break;
      }
      case 'end': {
        contentDiv.innerHTML +=
          '<hr/><strong>Finished reading ' +
          message.fileName +
          '</strong><hr/>';
        break;
      }
      case 'error': {
        contentDiv.innerHTML +=
          '<p style="color:red;">' + message.text + '</p>';
        break;
      }
    }
  });

  return (
    <Box
      sx={{
        width: '100vw',
        m: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '450px',
          m: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant='h4' fontWeight='bold'>
          SusCode Extension Scan Results: {readMe}
        </Typography>
      </Box>

      <Box>
        <Tabs value={0}>
          <Tab label='Scan Result:' />
        </Tabs>
        <Box sx={{ padding: 2 }}>
          <Typography variant='body1' fontWeight='light'>
            <div id='content'></div>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
