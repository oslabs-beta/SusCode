import * as fs from 'fs';
import * as path from 'path';
import  axios from 'axios';
import FormData from 'form-data';
// import { WebviewPanel } from 'vscode';
import { AnalysisResponse, FileUploadResponse } from '../types';
import { scanPaths } from './fileFinder';//need to acces this inputting the name to find the files to scan... with a for each? Does it return a giant object?
// import { setVirusTotal } from '../workers/virusTotalScan'; // this needs to be props, not passed completely
import * as vscode from 'vscode';
export function virusTotalScan(apiKey: string, extName: string, panel: vscode.WebviewPanel
    // , setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
//  const extArr: string[] = fs.readdirSync(trail);
//  const theFile: string[] = extArr.filter((file: string) =>
//     file.match(/readme.md?$/i)
//   );
    console.log('in virusTotalScan func poooooooooooooooop');
    interface FileAppendOptions {
        filename: string;
    }
    // const myApi: string = ''; // temporary placeholder - passed in from input or grabbing from vscode settings
    // store in settings.json as "myExtension.apiKey": "your-api-key-goes-here"
        //then import vscode from vscode
        //const apiKey = vscode.workspace.getConfiguration('myExtension').get<string>('apiKey')
            //https://code.visualstudio.com/api/references/vscode-api#workspaceConfiguration
            //https://code.visualstudio.com/api/references/vscode-api#Configuration
            //https://code.visualstudio.com/api/references/contribution-points#contributes.configuration <- Ali
                                //could do in combo with this 
    //encourage users to store API key in an .env
        //https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs

    //could also use VSCode secrets to store with a function in vscode.secrets.store 
    //apparently this is mainly for temporary storage and not meant for long term
    //https://code.visualstudio.com/api/references/vscode-api#secrets
    //https://code.visualstudio.com/api/references/vscode-api#secrets

    //Obfusication - good for making sure that the key can't be exposed in logs or anything
    //https://obfuscator.io/
    //https://github.com/javascript-obfuscator/javascript-obfuscator



    // const { myApi } = code to get api key from vscode;



    const sample: string = scanPaths[extName] && scanPaths[extName][0];//this is the filepath?
    if (!sample) {
        console.log('there is no sample')
    } else {
        console.log('sample: ', sample);
    }
    const fileStream: fs.ReadStream = fs.createReadStream(sample); //this was sample until I just changed it on Nov 5th;

    const formdata = new FormData(); // good stuff I need here******************************** * * * * *
    formdata.append("file", fileStream, {filename: 'extension.js'});

    function getTheResults(fileId: string, apiKey: string, count = 8) {
    
        axios.get<AnalysisResponse>(`https://www.virustotal.com/api/v3/analyses/${fileId}`, {
        headers: {
            'accept': 'application/json',
            'x-apikey': apiKey,
            }
        })
                // .then((response) => response.json())
        .then((response) => {
            const status = response.data.data.attributes.status;

            if (status === 'completed') {
                panel.webview.postMessage({type: 'vtResults', value: response.data.data.attributes.results});
            } else if (count > 0) {
                setTimeout(() => {
                    getTheResults(fileId, apiKey, count -= 1);
                }, 15000);     
            } else {
                panel.webview.postMessage({ type: 'vtResultsTimedOut', message: 'Getting the VirusTotal results timed out'});
            }

            console.log( 'within virusTotalScan in the getResults func:', response.data);
            
        })
        .catch((err: string) => {
            console.error('error fetching the analysis: ',err);
        });
    }

    axios.post<FileUploadResponse>("https://www.virustotal.com/api/v3/files", formdata, {
        headers: {
            "x-apikey": apiKey,
            ...formdata.getHeaders()
        },
        })
        .then((result) => {
            const fileId = result.data.data.id;
            if(fileId) {
                setTimeout(() => getTheResults(fileId, apiKey), 20000);
            } else {
                console.error('fileId is undefined');
                }  
        })
        .catch((error) => {
            console.error(`I'm in virusTotalScan worker and been an error running the api req scan: ${error}`);
            panel.webview.postMessage({type: 'modalOpen', message: 'Error in the scan'});
            throw error;
        });
}