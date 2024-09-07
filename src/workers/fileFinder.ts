import * as fs from 'fs';
import * as path from 'path';
import streamFilesInDirectory from './fileReader';
import { WebviewPanel } from 'vscode';
import { analyzeFilesForNetworkRequests, AnalysisResult } from './networkRequestFinder';

export function reader(extPath: string, panel: WebviewPanel):void {
  // makes list of items in main directory
  const dirArr = fs.readdirSync(extPath);
  // make an array with all the file path to be checked
  const regexJs = /.jsx?$/i;
  
  //helper function traversing the given directory
  const findingExtension = (foldArr: string[], extenPath:string):void => {
    // exclude folders and files we don't need to analyze
    foldArr = foldArr.filter(item => item !== 'node_modules' && item[0] !== '.');

    // finding JS files and sending it to fileReader
    if (foldArr.some(el => el.match(regexJs))) {
      const pathFoundFiles:string[] = [];
      const toBeTested = foldArr.filter(el => el.match(regexJs));
      for (let file of toBeTested){
        pathFoundFiles.push(path.join(extenPath, file)); 
      }
      // ***** remove console.log and add the test once we combine cleanup *****
      // console.log('path found files', pathFoundFiles);

      // For the time being, instead how about this calls my other shit for testing
      // streamFilesInDirectory(pathFoundFiles, panel);
      analyzeFilesForNetworkRequests(pathFoundFiles, panel);
    }

    //checking for directories
    for (let item of foldArr) {
      const insideExtension = path.join(extenPath, item);
      fs.lstat(insideExtension, (err: unknown, stats: { isDirectory: () => boolean; }) => {
        if (err) {
          console.log('error while finding file. ', err);
        } else {
          if (stats.isDirectory()) {
            // open up the folder and recurse through helper function
            const nextFolderArr = fs.readdirSync(insideExtension);
            findingExtension(nextFolderArr, insideExtension);
          }

        }
      });
    }
  };
  findingExtension(dirArr, extPath);

}