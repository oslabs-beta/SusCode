import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import * as os from "os";

export function streamFilesInDirectory(
    extension_name: string,
    panel: vscode.WebviewPanel
): void {

    let vscodeExtensionPath = path.join(os.homedir(), ".vscode/extensions");
    console.log(vscodeExtensionPath);

    // let singleScanExtension: undefined | string;
    // if (!extension_name) { // Scan all
    //     // Getting the folders we will be reading
    //     let extensions = fs.readdirSync(vscodeExtensionPath);

    //     // removing '.' files
    //     extensions = extensions.filter((extensions) => !extensions.startsWith("."));
    //     // adding the full path to each directory
    //     extensions = extensions.map((extension) => path.join(__dirname, extension));
    //     console.log(extensions);
    //     // With the array of extensions, we could read each one individually?
    // }

    // else {
    // get the matching extension name to the path
    // singleScanExtension = path.join(vscodeExtensionPath, extension_name);
    // }

    // Return the path for the single extension or the entire directory
    const directoryPath: string = extension_name ? path.join(vscodeExtensionPath, extension_name) : vscodeExtensionPath;

    // Read the directory and process each file
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            vscode.window.showErrorMessage(`Error reading directory: ${err.message}`);
            return;
        }

        files.forEach((file) => {
            // Reading the content of the files
            // Potentially move the file parsing data out so we can better
            // separate this functionality out

            const filePath = path.join(directoryPath, file);
            const myReadStream = fs.createReadStream(filePath, { encoding: 'utf8' });

            const patterns = [
                /eval\(/g,
                /new Function\(/g,
                /activate/g,
                /openBySpecify/g,
                /this.log/g,
            ];

            // const results: any = [];
            myReadStream.on('data', (chunk) => {
                for (let content of patterns) {
                    console.log('content', content);
                    let target = ("" + chunk).match(content);
                    // I may not want to push the results into an array- I'd
                    // want to transmit this info when I can
                    if (target) {
                        // results.push(target);
                        // Maybe here we can collect more information that we'd want to
                        // return to the user? Line number, file location, etc
                        panel.webview.postMessage({ command: 'update', text: target });
                    }
                }
            });

            myReadStream.on('end', () => {
                panel.webview.postMessage({ command: 'end', fileName: file });
            });

            myReadStream.on('error', (err) => {
                panel.webview.postMessage({ command: 'error', text: `Error reading file: ${err.message}` });
            });
        });
    });
}
