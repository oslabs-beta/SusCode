import * as fs from 'fs';

// find package.json file
// filter to find dependencies and dev-dependencies
// remove common packages like webpack and react and typescript
// make the api call

export default function packageChecker(JSONFile: string):void {

  interface npmPackage {
    "package" : {
      // "ecosystem": string, // should all be npm since vs extensions are all JS using node
      "name": string,
    },
    "version": unknown //doesn't let me use string. but this is always be string
  }

  // format for API
  function queryPush(array:string[]):void {

  }

// Read JSON from a file
  const data = JSON.parse(fs.readFileSync(JSONFile, 'utf8'));
  const dependencies = data.dependencies || {};
  const devDependencies = data.devDependencies || {};
  // format to send queries to API
  const queries: npmPackage[] = [];
  
  // find all dependency packages
  // console.log("Dependencies:", dependencies);
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
  // console.log("\nDevDependencies:", devDependencies);
  Object.entries(devDependencies).forEach(([packageName, version]) => {
    queries.push({
      "package" : {
        // "ecosystem": "npm",
        "name": packageName,
      },
      "version": version 
    });
  });
  
  let queriesObj = {"queries": queries};

  console.log("queries", JSON.stringify({"queries": queries}));

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
    // in index
    // of content
    const depVulns = [];
    for (const vulnObj of response.results) {
      if(Object.hasOwn(vulnObj, "vulns")) {
        // find the index of vulnObj
        const index = response.results.indexOf(vulnObj);
        depVulns.push([queries[index], vulnObj]);
      }
    }
    console.log(depVulns);
  })
  .catch(err => {
    console.log(err);
  });
};