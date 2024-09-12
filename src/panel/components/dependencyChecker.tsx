import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

export default function dependencyCheck(props: any) {
  const { depResults } = props;
  function getRandom() {
    return Math.random() * 100;
  }
  if (!depResults || (depResults && depResults.length === 0)) {
    return (
      <Typography
        key={getRandom()}
        variant='subtitle1'
        sx={{ marginLeft: '8px', color: '#b3b3b5' }}
      >
        No dependencies packages vulnerabilities found through OSV API
      </Typography>
    )
  }
  const packAndVulns = depResults.map((elObj: any) => {
    const fetchReturn = elObj[1].vulns;
    // takes all the vulnerable types and makes hyperlink to attach to the package name
    const vulData = fetchReturn.map(
      (vulType: { id: string; modified: string }) => {
        return (
          <div>
            id:{' '}
            <a href={`https://github.com/advisories/${vulType.id}`}>
              {vulType.id}
            </a>{' '}
            <br />
            modified: {vulType.modified}
          </div>
        );
      }
    );
    // for each package
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
          <strong>
            Package: {elObj[0].package.name} on version: {elObj[0].version}{' '}
          </strong>
        </AccordionSummary>
        <AccordionDetails>{vulData}</AccordionDetails>
      </Accordion>
    );
  });
  // return entire test result
  return <div>{packAndVulns}</div>;
}
