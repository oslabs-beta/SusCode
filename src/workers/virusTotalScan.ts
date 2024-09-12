import * as fs from 'fs';
import * as path from 'path';
import  axios from 'axios';
import FormData from 'form-data';
import { AnalysisResponse, FileUploadResponse } from '../types';
// import * as vscode from 'vscode';

interface FileAppendOptions {
    filename: string;
  }
const myApi: string = ''; // temporary placeholder - passed in from input or grabbing from vscode settings
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



const sample: string = ''
const fileStream: fs.ReadStream = fs.createReadStream(sample);

const formdata = new FormData(); // good stuff I need here******************************** * * * * *
formdata.append("file", fileStream, {filename: 'extension.js'});

function getTheResults(fileId: string, myApi: string) {
   
    axios.get<AnalysisResponse>(`https://www.virustotal.com/api/v3/analyses/${fileId}`, {
    headers: {
        'accept': 'application/json',
        'x-apikey': myApi,
        }
    })
            // .then((response) => response.json())
    .then((response) => {
        // console.log("Do what you will with these here results: ", response.data.data.attributes.results);
        //perhaps ... 
        //
    })
    .catch((err: string) => {
        console.error('error fetching the analysis: ',err)
    });
}

axios.post<FileUploadResponse>("https://www.virustotal.com/api/v3/files", formdata, {
    headers: {
        "x-apikey": myApi,
        ...formdata.getHeaders()
    },
    })
    .then((result) => {
        // console.log("yo, they did it", result.data)
        const fileId = result.data.data.id
        if(fileId) {
            setTimeout(() => getTheResults(fileId, myApi), 30000)
        } else {
            console.error('fileId is undefined')
            }  
    })
    .catch((error) => console.error(error));