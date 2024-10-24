import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl } from '@mui/base/FormControl';
import { useEffect, useState } from 'react';
// import apiGif from "../assets/Get_The_API_Key.gif";
const vscode = acquireVsCodeApi();


export default function VirusTotalHowToModal(props: any) {

  console.log('inside HowToModal right now.... ');
  const { modalOpen,  setModalOpen } = props;
  const [ activeStep, setActiveStep ] = useState(0);

  const steps = [
    {
      'text': 'Go to https://www.virustotal.com/gui/sign-in and sign up for an account',
      'box': <div/>,
      // 'button': ''
    },
    {
      'text':`Once you've verified your account and are logged in to virusTotal, `,
      'box': <img src="../assets/Get_The_API_Key.gif" height= "auto" width= "100%"/>,
      // 'button': ''
    },
    {
      'text': 'Create an ad',
      'box': 
        (<Box sx={{ width: 500, maxWidth: '100%' }}>
        {/* <TextField fullWidth label="fullWidth" id="fullWidth" /> */}
          <FormControl>
              <input id='apiKeyVal'/>
              <button onClick={() => {
                const inputVal = (document.getElementById('apiKeyVal') as HTMLInputElement)?.value;
                // storeApiKey(inputVal);
                console.log('the button in the third step was clicked')
              }}>Submit</button>
          </FormControl>
  
      </Box>),
      // 'button': <Button variant="contained" >Store Key</Button>
    },
  ];

  //It was a compiler issue. Annoying. SO.... 
//Below is chatgpt's solution 1 example. Another option is mocking vscode by defining it how it's used (i.e. const vscode = {blah: {etc: etc}})
  // async function storeApiKey(apiKey: string) {
  //   if (!vscode.workspace || !vscode.workspace.getConfiguration) {
  //     console.error('VS Code API is not available');
  //     return;
  //   }
  //   const secretStorage = vscode.workspace.getConfiguration().getSecretStorage();
  //   await secretStorage.store('myExtension.apiKey', apiKey);
  // }

  // async function getApiKey(): Promise<string | undefined> {
  //   const secretStorage = vscode.workspace.getConfiguration().getSecretStorage();
  //   return await secretStorage.get('myExtension.apiKey');
  // }

  function storeApiKey(apiKey: string) {
    vscode.postMessage({command: 'storeApiKey'});
  }
  
  if (!modalOpen) {
    return null; 
  };
  return (
    <div> dldskjfl;sdjfa;lksjfd
    <Box sx={{ width: '100%' }}>Bubble butt
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label.text}</StepLabel>
            <Box>
              {label.box}
            </Box>
          </Step>
        ))}
      </Stepper>
    </Box>
    </div>
  );
}