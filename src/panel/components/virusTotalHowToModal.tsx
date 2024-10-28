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

  // const steps = [
  //   {
  //     label: 'Select campaign settings',
  //     description: `For each ad campaign that you create, you can control how much
  //               you're willing to spend on clicks and conversions, which networks
  //               and geographical locations you want your ads to show on, and more.`,
  //   },
  //   {
  //     label: 'Create an ad group',
  //     description:
  //       'An ad group contains one or more ads which target a shared set of keywords.',
  //   },
  //   {
  //     label: 'Create an ad',
  //     description: `Try out different ad text to see what brings in the most customers,
  //               and learn how to enhance your ads using features like ad extensions.
  //               If you run into any problems with your ads, find out how to tell if
  //               they're running and how to resolve approval issues.`,
  //   },
  // ];
  
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
      'label': 'Create an ad group',
      'text':`Once you've verified your account and are logged in to virusTotal, `,
      'box': <div>Pic that's not working</div> ,
      // 'box': <img src={apiGif} height= "auto" width= "100%"/>,
      // 'button': ''
    },
    {
      'label': 'Create an ad',
      'text': 'Create an ad',
      'box': 
        (<Box sx={{ width: 500, maxWidth: '100%' }}>
        {/* <TextField fullWidth label="fullWidth" id="fullWidth" /> */}
          <FormControl>
              <input id='apiKeyVal'/>
              <button onClick={() => {
                const inputVal = (document.getElementById('apiKeyVal') as HTMLInputElement)?.value;
                storeApiKey(inputVal);
                console.log('the button in the third step was clicked: ', inputVal);

                setModalOpen(false)
              }}>Submit</button>
          </FormControl>
  
      </Box>),
      // 'button': <Button variant="contained" >Store Key</Button>
    },
  ];


  function storeApiKey(apiKey: string) {
    vscode.postMessage({command: 'storeApiKey'});
  }
  
  if (!modalOpen) {
    return null; 
  };
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
                <Box>{step.box}</Box>
                <Typography>{step.text}</Typography>
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
  // return (
  //   <div> dldskjfl;sdjfa;lksjfd
  //   <Box sx={{ width: '100%' }}>Bubble butt
  //     <Stepper activeStep={activeStep} alternativeLabel>
  //       {steps.map((label, index) => (
  //         <Step key={index}>
  //           <StepLabel>{label.text}</StepLabel>
  //           <Box>
  //             {label.box}
  //           </Box>
  //         </Step>
  //       ))}
  //     </Stepper>
  //   </Box>
  //   </div>
  // );
}

//export createVirusTotalHowToModal function?