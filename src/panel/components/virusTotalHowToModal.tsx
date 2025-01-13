import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl } from '@mui/base/FormControl';
import { useState } from 'react';
// import apiGif from "../../assets/Get_The_API_Key.gif";
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Modal from '@mui/material/Modal';
import path from 'path'
// import HelpIcon from '@mui/icons-material/Help';
export default function VirusTotalHowToModal(props: any) {

  const { modalOpen,  setModalOpen, vscode } = props;

  const [ activeStep, setActiveStep ] = useState(0);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const handleSubmit = () => {
    const inputVal = (document.getElementById('apiKeyVal') as HTMLInputElement)?.value;
    storeApiKey(inputVal);
    setModalOpen(false);
  };

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor:'background.paper',
    color: 'Black',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    backdropFilter: 'blur(25px)',
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleReset = () => {
    setActiveStep(0);
  };

  //Steps for HowToModal Stepper
  const steps = [
    {
      'label': 'Select campaign settings',
      'text': 
        (<h4 style={{ marginTop: 3 }}>You need an API key to use VirusTotal. Don't freaking panic! It's SUPER easy to get one. 
          Go   <Link href="https://www.virustotal.com/gui/sign-in">HERE</Link>{' '}
          and sign up for an account or sign in if you have an account.</h4>),
      'box': <div/>,

    },
    {
      'label': 'Get API Key',
      'text':(<>
              <h4 style={{ marginTop: 3, marginBottom: 1 }}>Once you've verified your account and are logged in to virusTotal: </h4>
              <ol style={{ marginTop: 2}}>
                <li>Click your name at the top-right corner for a drop down menu</li> 
                <li>Click 'API Key'</li>
                <li>Click the copy symbol in next to the blurred out API key</li>
              </ol>
              </>),
      'box': <div/>, //Would love to add a gif instead of an explanation
    },
    {
      'label': 'Store API Key',
      'text': (<h4 style={{marginBottom: 2, marginTop: 4}} >
      Submit your{' '}
      <span style={{ color: 'black', fontWeight: 'bold' }}>VirusTotal</span>
      {' '}API Key here so we can safely store it.
      {/* <HelpIcon onClick={() => {  console.log('HelpIcon clicked')  }} /> */}
      </h4>),
      //Would like to add the HelpIcon above to explain how we are safely storing their API Key bringing in another Modal
      'box': 
        (<Box sx={{ width: 500, maxWidth: '100%' }}>
          <FormControl style={{display: 'inline-block', backgroundColor: 'background.paper'}} >
            <TextField
              id="apiKeyVal"
              variant="outlined"
              placeholder="Paste your API key"
              inputProps={{
                sx: {
                  '&::placeholder': {
                    color: '#1769aa',
                    opacity: 3,
                  },
                  color: '#33ab9f',
                  
                },
              }}
              sx={{
                marginBottom: 3,
                width: 500,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                  backgroundColor: '#3D3D3D',
                  // color: '#33ab9f',
                  fontSize: '14px',
                  '& input': { padding: '8px 12px' },
                  '&:hover fieldset': {
                    borderColor: '#1769aa',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1769aa',
                  },
                },
              }} 
              onKeyDown={(event) => {
                if (event.key === 'Enter'){
                event.preventDefault();
                handleSubmit();
                }
              }}
            />
            <Box sx={{ mb: 2 }}>
              <Button variant='contained' onClick={handleSubmit} sx={{ mt: 1, mr: 1 }}>Submit</Button>
              <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }} >Back</Button>
            </Box>
          </FormControl>
      </Box>),
    },
  ];
  function storeApiKey(apiKey: any) {
    vscode.postMessage({type: 'storeApiKey', value: apiKey});
  }
  
  if (!modalOpen) {
    return null; 
  };
  if (modalOpen) {
    return (
      <Modal open={modalOpen} onClose={handleClose}>
      <Box sx={style}>
        <Stepper activeStep={activeStep} orientation="vertical" >
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
                  {activeStep < steps.length - 1 && ( 
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Continue
                  </Button>
                  )}
                  {activeStep !== 2 && (
                    <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                  )}
                  
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>All steps completed - you&apos;re finished</Typography>
          </Paper>
        )}
      </Box>
      </Modal>
    );
  }
  }
