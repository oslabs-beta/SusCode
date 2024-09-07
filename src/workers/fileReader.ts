import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export default function streamFilesInDirectory(
  files: string[],
  panel: vscode.WebviewPanel
): void {
  for (let file of files) {
    // Reading the content of the files
    // Potentially move the file parsing data out so we can better
    // separate this functionality out
    // console.log('thisss is', file);
    const readStream = fs.createReadStream(file, { encoding: 'utf8' });

    const patterns = [
      /eval\(/g,
      /new Function\(/g,
      /activate/g,
      /openBySpecify/g,
      /this.log/g,
    ];

    // const results: any = [];
    readStream.on('data', (chunk) => {
      for (let content of patterns) {
        // console.log('contentfdsf', content);
        let target = ('' + chunk).match(content);
        // I may not want to push the results into an array- I'd
        // want to transmit this info when I can
        // console.log('before target');
        if (target) {
          // console.log('in target');
          // results.push(target);
          // Maybe here we can collect more information that we'd want to
          // return to the user? Line number, file location, etc

          // type objInfo = {
          //     count: number;

          // }
          // function analysis(array: string[][]): {[scan: string]: objInfo} {
          //    const result: { [scan: string]: objInfo} = {};
          //    array.forEach((scanArr) => {
          //         result[scanArr[0]] = {
          //             count: scanArr.length,
          //         };
          //    });
          //     return result;
          // }

          panel.webview.postMessage({
            type: 'update',
            text: target,
            fileName: file,
          });
        }
      }
    });

    readStream.on('end', () => {
      panel.webview.postMessage({ type: 'end', fileName: file });
    });

    readStream.on('error', (err) => {
      panel.webview.postMessage({
        type: 'error',
        text: `Error reading file: ${err.message}`,
      });
    });
  }
}
