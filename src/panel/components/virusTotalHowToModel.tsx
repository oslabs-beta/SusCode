import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const steps = [
  {
    'text': 'Go to https://www.virustotal.com/gui/sign-in and sign up for an account',
    'box': '',
    'button': ''
  },
  {
    'text':`Once you've verified your account and are logged in to virusTotal, `,
    'box': <img src="../assets/Get_The_API_Key.gif" height= "auto" width= "100%"/>,
    'button': ''
  },
  {
    'text': 'Create an ad',
    'box': <Box sx={{ width: 500, maxWidth: '100%' }}>
      <TextField fullWidth label="fullWidth" id="fullWidth" />
    </Box>,
    'button': <Button variant="contained" >Store Key</Button>
  },
];



export default function HorizontalLinearAlternativeLabelStepper() {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={1} alternativeLabel>
        {steps.map((label) => (
          <Step key={label.text}>
            <StepLabel>{label.text}</StepLabel>
            <StepLabel>{label.box}</StepLabel>
            <StepLabel>{label.button}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}