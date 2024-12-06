import * as fs from 'fs';
import * as path from 'path';
import  axios from 'axios';
import FormData from 'form-data';
// import { WebviewPanel } from 'vscode';
import { AnalysisResponse, FileUploadResponse } from '../types';
import { scanPaths } from './fileFinder';//need to acces this inputting the name to find the files to scan... with a for each? Does it return a giant object?
// import { setVirusTotal } from '../workers/virusTotalScan'; // this needs to be props, not passed completely
import * as vscode from 'vscode';

// let timeoutId: NodeJS.Timeout | null = null;

export function virusTotalScan(apiKey: string, extName: string, panel: vscode.WebviewPanel) {

    interface FileAppendOptions {
        filename: string;
    }
    const trails: string[] = scanPaths[extName]; //scanPaths is an object with the file paths for each extension chosen
    const filenameArray = trails.map((trail) => {
        return path.basename(trail);
    });
    panel.webview.postMessage({type: 'vtResultsLoading', value: filenameArray, extName});
    let currentIndex: number = 0;
    
    //VirusTotal only allows 4 scans per minute
    function scanFilesWithRateLimit (files: string[], apiKey: string, panel: vscode.WebviewPanel) {
        const round = trails.slice(currentIndex, currentIndex + 4);
        round.forEach((trail) => {
        scanOneFile(trail, apiKey, panel);
        });
        currentIndex += 4;
        if (trails.length > 0) {
            setTimeout(() => scanFilesWithRateLimit(files, apiKey, panel), 18000); // Wait before the next batch
        }
    }  
        
    function scanOneFile (filePath: string, apiKey: string, panel: vscode.WebviewPanel){
        const fileStream: fs.ReadStream = fs.createReadStream(filePath); //this was sample until I just changed it on Nov 5th;

        const formdata = new FormData(); 
        const filename = path.basename(filePath);
        formdata.append("file", fileStream, {filename: filename}); 

        function getTheResults(fileId: string, apiKey: string, count = 30) {    
            axios.get<AnalysisResponse>(`https://www.virustotal.com/api/v3/analyses/${fileId}`, {
            headers: {
                'accept': 'application/json',
                'x-apikey': apiKey,
                }
            })
            .then((response) => {
                const status = response.data.data.attributes.status;

                if (status === 'completed') {
                    panel.webview.postMessage({type: 'vtResults', filename: filename, value: response.data.data.attributes, extName});
                } else if (count > 0) {
                    setTimeout(() => {
                        getTheResults(fileId, apiKey, count -= 1);
                    }, 15000);     
                } else {
                    panel.webview.postMessage({ type: 'vtResultsTimedOut', message: 'Getting the VirusTotal results timed out'});
                }           
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
                    // console.log('I think successful in the axios post request as I got a file ID: ', fileId);
                    setTimeout(() => getTheResults(fileId, apiKey), 20000);
                    panel.webview.postMessage({type: 'keyIsGood', message: 'The API key is good and scan is running'});
                } else {
                    console.error('fileId is undefined');
                    }  
            })
            .catch((error) => {
                //Would like to add a more dynamic approach to error handling based off of error code sent back
                console.error(`I'm in virusTotalScan worker and been an error running the api req scan: ${error}`);
                panel.webview.postMessage({type: 'modalOpen', message: 'Error in the scan'});
                panel.webview.postMessage({type: 'keyError', message: 'The API key is wrong or missing'});
                //Might want to add to assure timeout doesn't run if error
                    // if (timeoutId) {
                    //     clearTimeout(timeoutId);
                    // }
                throw error;
            });
        }

        scanFilesWithRateLimit(trails, apiKey, panel);
}