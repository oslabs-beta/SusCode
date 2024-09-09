import * as fs from 'fs';

// find package.json file
// filter to find dependencies and dev-dependencies
// remove common packages like webpack and react and typescript
// make the api call

export default function packageChecker(JSONFile: string):void {
  const readStream = fs.createReadStream(JSONFile, { encoding: 'utf8' });
  const arrOfDep = [];

  readStream.on('data', (chunk) => {
    //find all the dev-dep and deps
    console.log('in packages.ts', chunk);
  });
};