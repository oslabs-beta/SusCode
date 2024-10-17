import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl } from '@mui/base/FormControl';
import * as vscode from 'vscode';
import { useEffect, useState } from 'react';






export default function HorizontalLinearAlternativeLabelStepper(props: any) {
  const {modalOpen,  setModelOpen} = props
  const [activeStep, setActiveStep ] = useState(0)

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
                storeApiKey(inputVal);
              }}>Submit</button>
          </FormControl>
  
      </Box>),
      // 'button': <Button variant="contained" >Store Key</Button>
    },
  ];

  async function storeApiKey(apiKey: string) {
    const secretStorage = vscode.workspace.getConfiguration().getSecretStorage();
    await secretStorage.store('myExtension.apiKey', apiKey);
  }

  async function getApiKey(): Promise<string | undefined> {
    const secretStorage = vscode.workspace.getConfiguration().getSecretStorage();
    return await secretStorage.get('myExtension.apiKey');
  }
  
  return (
    <Box sx={{ width: '100%' }}>
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
  );
}