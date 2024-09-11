// import { patternDictionary } from '../../patternDictionary';
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { infoObj } from '../../types';
import getPatternDictionary from '../../patternDictionary';

export default function PatternInfo(props: any) {
  let patternDictionary = getPatternDictionary();

  const { patternNames } = props;
  let patternInfoObj: infoObj;
  //iterate through the dictionary and grab the object where the current pattern name is a match with the regex expression
  const accordianLayers = patternNames.map((patternName: any) => {
    patternDictionary.forEach((patternObj: any) => {
      if (patternName.includes(patternObj.pattern)) {
        patternInfoObj = patternObj;
      }
    });

    return (
      <Accordion
        sx={{
          backgroundColor: 'inherit',
          color: 'rgb(191 182 182 / 60%)',
          boxShadow: 5,
        }}
      >
        <AccordionSummary
          sx={{ color: 'rgb(231 231 231 / 60%)' }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1-content'
          id='panel1-header'
        >
          {patternInfoObj.heading}
        </AccordionSummary>
        <AccordionDetails>{patternInfoObj.info}</AccordionDetails>
      </Accordion>
    );
  });

  return <div>{accordianLayers}</div>;
}

module.exports = PatternInfo;
