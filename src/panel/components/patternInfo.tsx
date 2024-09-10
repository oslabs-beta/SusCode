// import { patternDictionary } from '../../patternDictionary';
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { infoObj } from '../../types';
import getPatternDictionary from '../../patternDictionary';
// const patterns = [
//   /eval ?\(/g,
//   /exec ?\(/g,
//   /system ?\(/g,
//   /popen ?\(/g,
//   /shell_exec ?\(/g,
//   /os.system ?\(/g,
//   /document.write ?\(/g,
//   /dangerouslySetInnerHTML ?\(/g,
// ];

// const patternDictionary: infoObj[] = [
//   {
//     pattern: 'eval',
//     heading: 'Evaluation',
//     info: 'This code pattern can introduce vulnerabilities because it allows the execution of arbitrary code in a way that is hard to control. This makes the code within this extension vulnerable to attacks. Specifically, eval executes a string as JavaScript code. It can easily allow attackers to execute arbitrary code if untrusted input is passed to it, leading to code injection vulnerabilities.',
//     regex: [patterns[0]],
//   },
//   {
//     pattern: 'exec',
//     heading: 'Execute',
//     info: 'This code pattern can introduce vulnerabilities because it allows the execution of arbitrary code in a way that is hard to control. This makes the code within this extension vulnerable to attacks. Specifically, exec executes system commands in many programming languages (e.g., PHP, Python). Like shell_exec, it can be used for command injection if untrusted input is processed without validation.',
//     regex: [patterns[1]],
//   },
//   {
//     pattern: 'system',
//     heading: 'System Commands',
//     info: 'This code pattern can introduce vulnerabilities because it allows the execution of arbitrary code or the insertion of content in a way that is hard to control. This makes the code within this extension vulnerable to attacks. Specifically, System commands (e.g., System() in Java) allow running system-level commands. If unvalidated input is passed, it could result in command injection and compromise system security.',
//     regex: [patterns[2]],
//   },
//   {
//     pattern: 'popen',
//     heading: 'Shell Execution',
//     info: 'Opens a pipe to or from a process, allowing for execution of system commands and communication with them. If user input is passed to popen without validation or sanitization, it can result in command injection, enabling attackers to execute malicious commands.',
//     regex: [patterns[3]],
//   },
//   {
//     pattern: 'shell_exec',
//     heading: 'Shell Execution',
//     info: 'This code pattern can introduce vulnerabilities because it allows the execution of arbitrary code in a way that is hard to control. This makes the code within this extension vulnerable to attacks. Specifically, shell_exec executes shell commands directly from the code. If untrusted input is passed to it, it can lead to command injection, allowing attackers to execute arbitrary system commands.',
//     regex: [patterns[4]],
//   },
//   {
//     pattern: 'os.system',
//     heading: 'System-level Commands',
//     info: 'This code pattern can introduce vulnerabilities because it allows the execution of arbitrary code in a way that is hard to control. This makes the code within this extension vulnerable to attacks. Specifically, os.system runs shell commands in Python. Passing unvalidated or unsanitized user input can allow attackers to execute harmful commands, resulting in command injection.',
//     regex: [patterns[5]],
//   },
//   {
//     pattern: 'document.write',
//     heading: 'Cross-Site Scripting (XSS)',
//     info: 'This code pattern can introduce vulnerabilities because it allows the insertion of content in a way that is hard to control. This makes the code within this extension vulnerable to attacks. Specifically, document.write inserts content directly into the DOM in JavaScript. If it includes user-controlled input, it can lead to cross-site scripting (XSS) attacks, allowing malicious scripts to be executed in the user’s browser.',
//     regex: [patterns[6]],
//   },
//   {
//     pattern: 'dangerouslySetInnerHTML',
//     heading: 'React- Exposes App to XSS',
//     info: 'This code pattern can introduce vulnerabilities because it allows the insertion of content in a way that is hard to control. This makes the code within this extension vulnerable to attacks. Specifically, dangerouslySetInnerHTML is a React property that sets HTML directly in the DOM. If untrusted data is used without proper sanitization, it poses a high risk of XSS by injecting harmful HTML or scripts into the webpage.',
//     regex: [patterns[7]],
//   },
// ];

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
