const fs = require('fs');
const path = require('path');

export function reader(extPath: string):void {
  // makes list of items in main directory
  const dirArr = fs.readdirSync(extPath);

  //helper function traversing the given directory
  const findingExtension = (foldArr:string[], extenPath:string):void => {
    const extensionRegex = new RegExp('extensions?','gi');
    // if dir arr has extension file we go intoo condition
    if (foldArr.some(el => extensionRegex.test(el))) {
      const toBeTested = foldArr.filter(el => el.match(extensionRegex) && el.match(/.jsx?$/i));
      // we can either evaluate test here OR pass the path into the test
      //currently only testing the first extension.js file (could have more than 1)
      const readStream = fs.createReadStream(path.join(extenPath, toBeTested[0]), 'utf8');
      //this is where we import the test
      // const tempWriteStream = fs.createWriteStream(__dirname + '/tempTestingPlaceholder.txt')
      // readStream.pipe(tempWriteStream)
    }
    // traversing to find extension files
    if (!foldArr.some(el => extensionRegex.test(el))) {
      foldArr.filter(item => item !== 'node_modules' && item[0] !== '.');
      for (let item of foldArr) {
        const insideExtension = path.join(extenPath, item);
        fs.lstat(insideExtension, (err: unknown, stats: { isDirectory: () => boolean; }) => {
          if (err) {
            console.log('error while finding file: ', err);
          } else {
            if (stats.isDirectory()) {
              const nextFolderArr = fs.readdirSync(insideExtension);
              findingExtension(nextFolderArr, insideExtension);
            }
          }
        });
      }
    }
  };
  findingExtension(dirArr, extPath);
}