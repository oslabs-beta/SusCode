import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const patterns = [
  /eval\(/g,
  /new Function\(/g,
  /activate/g,
  /openBySpecify/g,
  /this.log/g,
];

//extension folder path
// let customPath = path.join(__dirname);
let customPath = path.join(os.homedir(), ".vscode/extensions");
console.log(customPath);
//isolate for the base user code
// const arrayOfPath = customPath.split('/');
// console.log(arrayOfPath);
// const rootPath = []
// //concat the first 3
// for (let i = 0; i < 3; i++) {
//     rootPath.push(arrayOfPath[i])
// }
let extensions = fs.readdirSync(customPath);
extensions.filter((extensions) => !extensions.startsWith("."));
console.log(extensions);

const dynamicReader = async function (arrExt: string[]) {
  console.log(arrExt);
  const results: any = [];
  // need function that will find each path to extension file
  // const test = rootPath.join('/') + '/.vscode/extensions/' + arrExt[3] + '/dist/extension.js'
  const test = path.join(customPath, "/rat-hooker/virus.js");

  return Promise.resolve()
  .then(() => {
    const myReadStream = fs.createReadStream(test, "utf8");
    // test if we got the right file
    // const myWriteStream = fs.createWriteStream(__dirname + '/writeTest.js');
    // myReadStream.pipe(myWriteStream)
    console.log(test);
    console.log('in the read stream!!');
    console.log('bahhh');
    myReadStream.on("data", function (d) {
      for (let content of patterns) {
        console.log('content', content);
        let target = ("" + d).match(content);
        if (target) {
          results.push(target);
        }
      }
    });

    myReadStream.on('error',function(err){
        // then(err, results);
        console.error('Stream error:', err);
        throw err;
    });

    myReadStream.on('close',function(huh: any){
      console.log(huh);
      console.log('close');
      console.log(results);
      return results;
    });

    // testing conditions

    console.log(results);
    
  });
};

// console.log(dynamicReader(string))
export const testFunc = async function () {
  // let customPath = path.join(__dirname);

  // let customPath = path.join(os.homedir(), '.vscode');

  // console.log(customPath);
  let yo = await dynamicReader(extensions);
  console.log('final', yo);

  // const returned = dynamicReader(string)
  // console.log(returned)
  // returned.then({ data } => data)

  // return returned
};
// console.log(testFunc())
// console.log(dynamicReader(extensions))
//

// uncomment below to create text file
// textFile();
