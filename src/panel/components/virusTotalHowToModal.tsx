import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl } from '@mui/base/FormControl';
import { useEffect, useState } from 'react';
import apiGif from "../../assets/Get_The_API_Key.gif";
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Modal from '@mui/material/Modal';
// import HelpIcon from '@mui/icons-material/Help';
// const vscode = acquireVsCodeApi();
// import ApiTransparencyModal from './apiTransparencyModal';



export default function VirusTotalHowToModal(props: any) {

  console.log('inside HowToModal right now.... ');
  const { modalOpen,  setModalOpen, vscode } = props;
  const [ activeStep, setActiveStep ] = useState(0);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

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
  
 

  // a:link {
  //   color: green;
  //   background-color: transparent;
  //   text-decoration: none;
  // }
  
  // a:visited {
  //   color: pink;
  //   background-color: transparent;
  //   text-decoration: none;
  // }
  
  // a:hover {
  //   color: red;
  //   background-color: transparent;
  //   text-decoration: underline;
  // }
  
  // a:active {
  //   color: yellow;
  //   background-color: transparent;
  //   text-decoration: underline;
  // }
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
      'text': 
        (<>You need an API key to use VirusTotal. Don't freaking panic! It's SUPER easy to get one. 
      Go   <Link href="https://www.virustotal.com/gui/sign-in">HERE</Link>{' '}
       and sign up for an account or sign in if you have an account.</>),
      'box': <div/>,
      // 'button': ''
    },
    {
      'label': 'Get API Key',
      'text':`Once you've verified your account and are logged in to virusTotal, copy the API key like so...`,
      // 'box': <div>Pic that's not working</div> ,
      'box': <><img src={apiGif} height= "auto" width= "100%"/></>,
      // 'button': ''
    },
    {
      'label': 'Enter API Key',
      'text': <>
      Paste and submit your{' '}
      <span style={{ color: 'black', fontWeight: 'bold' }}>VirusTotal</span>
      {' '}API Key here so we can safely store it.
      {/* <HelpIcon onClick={() => {
        console.log('helpIcon hath been clickerthed');
        <ApiTransparencyModal/>;
      }}  sx={{color: 'purple'}} /> */}
      </>,
      'box': 
        (<Box sx={{ width: 500, maxWidth: '100%' }}>
        {/* <TextField fullWidth label="fullWidth" id="fullWidth" /> */}
          <FormControl style={{display: 'inline-block', backgroundColor: 'background.paper'}} >
            
            {/* <Typography variant='subtitle1' sx={{color: '#1769aa', marginBottom: 0}} >
              
                <span style={{ color: '#33ab9f' }}>VirusTotal</span>
                <span style={{ color: '#1769aa' }}> API Key</span>
            </Typography> */}
            {/* <label style={{color: '#1769aa'}}><b>API Key</b></label>
            <input id='apiKeyVal' style={{width: 400, height: 30, color: 'black', fontSize: '14px', backgroundColor: '#33ab9f', borderRadius: '6px'}} /> */}
            <TextField
              id="apiKeyVal"
              variant="outlined"
              placeholder="Enter your API key"
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
                
                width: 400,
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
            />
            <Box sx={{ mb: 2 }}>
            
              <Button variant='contained' onClick={() => {
                const inputVal = (document.getElementById('apiKeyVal') as HTMLInputElement)?.value;
                storeApiKey(inputVal);
                console.log('the button in the third step was clicked: ', inputVal);

                setModalOpen(false);
              }} sx={{
                mt: 1, mr: 1
                // marginTop: 2,
                // bgcolor: '#1769aa',
                // color: '#fff',
                // '&:hover': {
                //   bgcolor: '#33ab9f',
                // },
              }}>Submit</Button>
              <Button
                onClick={handleBack}
                sx={{ mt: 1, mr: 1 }}
              >
              Back
              </Button>
            </Box>
            {/* <button onClick={() => {
              const inputVal = (document.getElementById('apiKeyVal') as HTMLInputElement)?.value;
              storeApiKey(inputVal);
              console.log('the button in the third step was clicked: ', inputVal);

              setModalOpen(false);
              }}>Submit</button> */}
           
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
            {/* <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              Reset
            </Button> */}
          </Paper>
        )}
      </Box>
      </Modal>
    );
  }
  }
