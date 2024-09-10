import * as React from 'react';

export default function dependencyCheck(props:any) {
  const { depResults } = props;
  if (depResults.length === 0) {
    return(<div>No dependencies packages vulnerbilities found through OSV API</div>);
  }
  const packAndVulns = depResults.map((elObj:any) => {
    const fetchReturn = elObj[1].vulns;
    // takes all the vulnerable types and makes hyperlink to attach to the package name
    const vulData = fetchReturn.map((vulType: {id:string, modified:string}) => {
      return(
        <div>
          id: <a href={`https://github.com/advisories/${vulType.id}`}>{vulType.id}</a> <br/>
          modified: {vulType.modified} 
        </div>
      );
    });
    // for each package
    return (<div>
      <strong>Package: {elObj[0].package.name} on version: {elObj[0].version} </strong>
      {vulData}
      <br/>
    </div>);
  });
  // return entire test result
  return (
    <div>
      {packAndVulns}
    </div>
  );
}