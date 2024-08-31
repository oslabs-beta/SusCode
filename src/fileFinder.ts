import * as fs from 'fs';
import * as path from 'path';
import streamFilesInDirectory from './fileReader';
import { WebviewPanel } from 'vscode';

export function reader(extPath: string, panel: WebviewPanel):void {
  // makes list of items in main directory
  console.log('inside fileFinder');
  console.log('dirArr: ', extPath);
  const dirArr = fs.readdirSync(extPath);
  // make an array with all the file path to be checked
  const regexJs = /.jsx?$/i;
  // using set
  // const pathFoundFiles = new Set<string>();
  const pathFoundFiles:string[] = [];
  console.log('array of found files', pathFoundFiles);

  //helper function traversing the given directory
  const findingExtension = (foldArr: string[], extenPath:string):void => {
    //const extensionRegex = new RegExp('extensions?','gi');
    // if dir arr has extension file we go into condition
    // if (foldArr.some(el => el.match(/.jsx?$/i))) {
    //   const toBeTested = foldArr.filter(el => el.match(/.jsx?$/i));
    //   for (let file of toBeTested){
    //     pathFoundFiles.push(path.join(extenPath, file));
    //   }
    // }
    // traversing to find extension files
    // exclude folders and files we don't need to analyze // dynamic: do so for all files in the gitignore
    foldArr.filter(item => item !== 'node_modules' && item[0] !== '.');
        //console.log('inside some', Array.from(pathFoundFiles));
    if (foldArr.some(el => el.match(/.jsx?$/i))) {
      const toBeTested = foldArr.filter(el => el.match(/.jsx?$/i));
      console.log('toBeTested', toBeTested);
      for (let file of toBeTested){
        // pathFoundFiles.add(path.join(extenPath, file));
        pathFoundFiles.push(path.join(extenPath, file));
      }
    }
    //checking for directories
    for (let item of foldArr) {
      console.log('inside loop', item)
      const insideExtension = path.join(extenPath, item);
      fs.lstat(insideExtension, (err: unknown, stats: { isDirectory: () => boolean; }) => {
        if (err) {
          console.log('error while finding file. ', err);
        } else {
          if (stats.isDirectory()) {
            const nextFolderArr = fs.readdirSync(insideExtension);
            findingExtension(nextFolderArr, insideExtension);
          }

        }
      });
    }
    return;
  };

  findingExtension(dirArr, extPath);
  // once get all the file path we want to test give it to tester funcs
  console.log('here');
  console.log('pathfoundfiles', Array.from(pathFoundFiles));
  //streamFilesInDirectory(pathFoundFiles, panel);

}