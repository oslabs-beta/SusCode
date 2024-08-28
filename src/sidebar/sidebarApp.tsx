import * as React from 'react';
import * as vscode from 'vscode';
import { useEffect, useState } from 'react';
// import { getNonce } from './getNonce';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';

// const nonce = getNonce();

function App() {
  // const vscode = acquireVsCodeApi();

  // document
  //   .querySelector('.get-extensions-button')
  //   .addEventListener('click', () => {
  //     vscode.postMessage({ type: 'getExtensions' });
  //   });

  // window.addEventListener('message', (event) => {
  //   const message = event.data; // The json data that the extension sent
  //   switch (message.type) {
  //     case 'displayExtensions': {
  //       function displayExtensions(extensions) {
  //         const exButtons = document.querySelector('.extensions-list');

  //         for (const extension of extensions) {
  //           const exButton = document.createElement('button');
  //           exButton.className = 'extensionButton';
  //           exButton.innerText = extension[0];
  //           exButton.addEventListener('click', (e) => {
  //             clickHandler(extension[1]);
  //           });
  //           exButtons.appendChild(exButton);
  //         }
  //       }
  //       displayExtensions(message.value);
  //     }
  //   }
  // });

  // function clickHandler(extensionPath) {
  //   vscode.postMessage({ type: 'extensionSelected', value: extensionPath });
  // }
  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1-content'
          id='panel1-header'
        >
          Accordion 1
        </AccordionSummary>
        <AccordionDetails>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel2-content'
          id='panel2-header'
        >
          Accordion 2
        </AccordionSummary>
        <AccordionDetails>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel3-content'
          id='panel3-header'
        >
          Accordion Actions
        </AccordionSummary>
        <AccordionDetails>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </AccordionDetails>
        <AccordionActions>
          <Button>Cancel</Button>
          <Button>Agree</Button>
        </AccordionActions>
      </Accordion>
    </div>
  );
}
export default App;

/**import './App.css';
import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'; 
import Typography from '@mui/material/Typography'; 
import { useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function TabPanel({ value, index, children }) {
  return (
    <div hidden={value !== index}>
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function App() {
  const [value, setValue] = useState(0);

  // render txt file when button is clicked
  const handleButtonClick = () => {
    console.log("Button clicked!");
    window.postMessage({ command: 'cowsay' }, '*');
};

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100vw", m: 3, display: "flex", flexDirection: "column", justifyContent: "center" }}>

      <Box sx={{ width: "200px", m: 3, display: "flex", flexDirection: "column" }}>
        <Typography variant="h1">SusCode!</Typography>
      </Box>  

      <Box sx={{ m: 3 }}>
        <Button variant="contained" onClick={handleButtonClick}>Start Extension Scan</Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="Item One" />
          <Tab label="Item Two" />
          <Tab label="Item Three" />
        </Tabs>

        <TabPanel value={value} index={0}>
          Content for Item One
        </TabPanel>
        <TabPanel value={value} index={1}>
          Content for Item Two
        </TabPanel>
        <TabPanel value={value} index={2}>
          Content for Item Three
        </TabPanel>
      </Box>
    </Box>
  ); 
}

export default App;
  
/*
Other Components Used:

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NavigationIcon from '@mui/icons-material/Navigation';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Rating from '@mui/material/Rating';
import LinearProgress from '@mui/material/LinearProgress';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { TreeItem, SimpleTreeView } from '@mui/x-tree-view';

const handleChange = (event) => {
    setAge(event.target.value);
  };

  const [ratingValue, setRatingValue] = useState(null);
  const [age, setAge] = React.useState('');

<Box sx={{ m: 3 }}>  
        <Typography>How Would You Rate the Security of this Extension?</Typography>
        <Rating value={ratingValue} onChange={(_, value) => setRatingValue(value)}/>
        <Typography>Rating: {ratingValue}</Typography>
      </Box> 
  
<Box sx={{ width: "25vw", m: 3 }}>
        <Accordion>
        <AccordionSummary id="panel-header" aria-controls="panel-content">
          Extensions
        </AccordionSummary>
        <AccordionDetails>
          These are the result of the extension security scan. Bad news: your extensions are FULL of malicious code. 
        </AccordionDetails>
        </Accordion>
      </Box>

<Box sx={{ width: "25vw", m: 3 }}>
          <LinearProgress></LinearProgress>
      </Box>    

<FormControl sx={{ width: "50vw", m: 3 }}>
        <FormLabel id="demo-radio-buttons-group-label" color="primary">Extensions:</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="liveshare"
          name="radio-buttons-group"
        >
          <FormControlLabel value="liveshare" control={<Radio />} label="LiveShare" />
          <FormControlLabel value="postMan" control={<Radio />} label="PostMan" />
          <FormControlLabel value="suscode" control={<Radio />} label="SusCode" />
        </RadioGroup>
      </FormControl>

<Box>
        <Checkbox sx={{ color: "#d50000" }}/>
        <Checkbox sx={{ color: "#e65100" }}/>
        <Checkbox sx={{ color: "#ffff00" }}/>
        <Checkbox sx={{ color: "#69f0ae" }}/>
        <Checkbox sx={{ color: "#e91e63" }}/>
      </Box>

<Box>
        <SimpleTreeView>
          <TreeItem itemId="1" label="SusCode" />
          <TreeItem itemId="2" label="LiveShare" />
        </SimpleTreeView>
      </Box>

      <Box sx={{ '& > :not(style)': { m: 1 } }}>
        <Fab color="primary" aria-label="add">
          <AddIcon />
        </Fab>
        <Fab color="secondary" aria-label="edit">
          <EditIcon />
        </Fab>
        <Fab variant="extended">
          <NavigationIcon sx={{ mr: 1 }} />
          Navigate
        </Fab>
        <Fab disabled aria-label="like">
          <FavoriteIcon />
        </Fab>
      </Box>

      <FormControl sx={{ m: 1, width: "25vw" }} size="small">
        <InputLabel id="demo-select-small-label">Extenions</InputLabel>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={age}
          label="Extensions"
          onChange={handleChange}
          sx={{
            backgroundColor: 'primary', // Box background color
            color: 'primary', // Text color
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1976d2', // Border color
            }
          }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>LiveShare</MenuItem>
          <MenuItem value={20}>PostMan</MenuItem>
          <MenuItem value={30}>SusCode</MenuItem>
        </Select>
      </FormControl>

 */
