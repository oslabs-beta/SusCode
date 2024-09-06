import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
// const vscode = acquireVsCodeApi();

function findReadMe(
  trail: string, panel: vscode.WebviewPanel,
  callback: (err: string | null, description: string | null) => void
): string | void {
  //   const fileRegex = new RegExp('readme?', 'g');
  const extArr: string[] = fs.readdirSync(trail);
  const theReadme: string[] = extArr.filter((file: string) =>
    file.match(/readme.md?$/i)
  );
  //   console.log(theReadme);
  if (theReadme.length === 0) {
    callback('No README.md file found.', null);
    return;
  }
  //   Connect the paths to create a direct path to the file we're looking for
  const myReadStream: fs.ReadStream = fs.createReadStream(
    path.join(trail, theReadme[0]),
    { encoding: 'utf8' }
  );
  //   console.log(theReadme);

  //placeholder for the ext description
  let description: string | null;

  //go through the file
  myReadStream.on('data', (chunk: string) => {
    const arr: string[] = chunk.split('\n');
    // console.log(arr);
    arr.every((streamBit) => {
      if (streamBit.length > 70) {
        description = streamBit;
        return false;
      }
      return true;
    });

    // console.log(description);
    //create end and err
  });
  myReadStream.on('end', () => {
    console.log(description);
    callback(null, description);

    //add the functionality to send it elsewhere or populate the description
  });

  myReadStream.on('error', (err: Error) => {
    callback(err.message, null);
    console.error(err);
  });
}

export default findReadMe;