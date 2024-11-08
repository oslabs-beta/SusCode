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
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// const vscode = acquireVsCodeApi();



export default function VirusTotalHowToModal(props: any) {

  console.log('inside HowToModal right now.... ');
  const { modalOpen,  setModalOpen, vscode } = props;
  const [ activeStep, setActiveStep ] = useState(0);
  
  // export default function VerticalLinearStepper() {
  //   const [activeStep, setActiveStep] = React.useState(0);
  
    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
  
    const handleReset = () => {
      setActiveStep(0);
    };
  
  

  const steps = [
    {
      'label': 'Select campaign settings',
      'text': 'Go to https://www.virustotal.com/gui/sign-in and sign up for an account',
      'box': <div/>,
      // 'button': ''
    },
    {
      'label': 'Get API Key',
      'text':`Once you've verified your account and are logged in to virusTotal, `,
      'box': <div>Pic that's not working</div> ,
      // 'box': <img src={apiGif} height= "auto" width= "100%"/>,
      // 'button': ''
    },
    {
      'label': 'Enter API Key',
      'text': 'Paste and Submit API Key Here',
      'box': 
        (<Box sx={{ width: 500, maxWidth: '100%' }}>
        {/* <TextField fullWidth label="fullWidth" id="fullWidth" /> */}
          <FormControl>
              <input id='apiKeyVal'/>
              <button onClick={() => {
                const inputVal = (document.getElementById('apiKeyVal') as HTMLInputElement)?.value;
                storeApiKey(inputVal);
                console.log('the button in the third step was clicked: ', inputVal);

                setModalOpen(false);
              }}>Submit</button>
          </FormControl>
  
      </Box>),
      // 'button': <Button variant="contained" >Store Key</Button>
    },
  ];


  function storeApiKey(apiKey: any) {
    vscode.postMessage({type: 'storeApiKey', value: apiKey});
  }
  
  if (!modalOpen) {
    return null; 
  };
  // if(keyObtained) {
  //   return (
  //     <Box>
  //       <Box>API Key found. Would you like to use or enter new key?</Box>
  //       <Button onClick={() => {
  //         console.log('button to use current api key clicked and here is where scan functionality starts')
  //         }} >Use</Button>
  //       <Button onClick={() => {
  //         console.log(`here is where you enter a new key??`);
  //         return (
  //           <form onSubmit={submitNewKey} >
  //             <TextField id="newKey" label="Outlined" variant="outlined" />
  //             <Button type='submit'>Submit new key</Button>
  //           </form>
  //         );
  //         }} >Enter New Key</Button>
  //     </Box>
  //   ); 
  // }
  if (modalOpen) {
    return (
      <Box sx={{ maxWidth: 400 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                  index === steps.length - 1 ? (
                    <Typography variant="caption">Last step</Typography>
                  ) : null
                }
              >
                {step.label}
              </StepLabel>
              <StepContent>
                
                <Typography>{step.text}</Typography>
                <Box>{step.box}</Box>
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              Reset
            </Button>
          </Paper>
        )}
      </Box>
    );
  }
  }
