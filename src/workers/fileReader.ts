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
        let target = ('' + chunk).match(content);
        // I may not want to push the results into an array- I'd
        // want to transmit this info when I can
        if (target) {
          // Maybe here we can collect more information that we'd want to
          // return to the user? Line number, file location, etc

          function counter(array: string[]): { name: string; count: number } {
            return {
              name: array[0],
              count: array.length,
            };
          }
          let updatedTarget = counter(target);

          panel.webview.postMessage({
            type: 'update',
            text: updatedTarget, // { functionName : activate, count: 5 }
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
