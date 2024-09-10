import * as fs from 'fs';
import { WebviewPanel } from 'vscode';

// find package.json file
// filter to find dependencies and dev-dependencies
// remove common packages like webpack and react and typescript
// make the api call

export default function packageChecker(JSONFile: string, panel: WebviewPanel, name: string):void {

  interface npmPackage {
    "package" : {
      // "ecosystem": string, API documentation said to add ecosystem, but doesn't work for npm. Keeping for future reference
      "name": string,
    },
    "version": unknown //doesn't let me use string. but this is always be string
  }

// Read JSON from a file
  const data = JSON.parse(fs.readFileSync(JSONFile, 'utf8'));
  const dependencies = data.dependencies || {};
  const devDependencies = data.devDependencies || {};
  // format to send queries to API
  const queries: npmPackage[] = [];
  
  // find all dependency packages
  Object.entries(dependencies).forEach(([packageName, version]) => {
      queries.push({
        "package" : {
          // "ecosystem": "npm",
          "name": packageName,
        },
        "version": version 
      });
  });
  
  // find all dev dependency packages
  Object.entries(devDependencies).forEach(([packageName, version]) => {
    queries.push({
      "package" : {
        // "ecosystem": "npm",
        "name": packageName,
      },
      "version": version 
    });
  });

  //API call to OSV
  fetch('https://api.osv.dev/v1/querybatch',{
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({"queries": queries})
  })
  .then(data => {
    if (data.ok){
    return data.json();
  } else {
    throw new Error;
  }
  })
  .then(response => {
    //logic for message send vulnerbility and npm package name
    const depVulns = [];
    for (const vulnObj of response.results) {
      if(Object.hasOwn(vulnObj, "vulns")) {
        // find the index of vulnObj
        const index = response.results.indexOf(vulnObj);
        depVulns.push([queries[index], vulnObj]);
      }
    }
    // console.log('depVulns', depVulns)
    // give info to frontend to handle
    panel.webview.postMessage({
      type: 'dependencyCheck',
      displayName: name, 
      depVulns: depVulns
    });
  })
  .catch(err => {
    console.log(err);
  });
};