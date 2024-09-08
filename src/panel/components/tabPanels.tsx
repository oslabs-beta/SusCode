import * as React from 'react';
import TabPanel from '@mui/lab/TabPanel';
import { scanResult } from '../../types';
import Results from './results';
import Box from '@mui/material/Box';
import ReadMeDiv from './readMeDiv';

export default function TabPanels(props: any) {
  const { displayNames, panelState, readMe } = props;

  function getRandom() {
    return Math.random() * 100;
  }

  const tabPanels = displayNames.map((extensionName: string, i: number) => {
    let value = i.toString();
    let content = `panelFor${extensionName}`;
    const panel: scanResult = panelState[extensionName] || {
      results: [{ funcName: 'no results yet', count: 0 }],
    };

    return (
      <TabPanel value={value} key={getRandom()} id={content}>
        <Results results={panel.results} />
        <ReadMeDiv readMe={readMe} />
      </TabPanel>
    );
  });

  return <Box>{tabPanels}</Box>;
}
module.exports = TabPanels;

// import * as React from 'react';
// import { useState } from 'react';
// import TabPanel from '@mui/lab/TabPanel';
// import Tooltip from '@mui/material/Tooltip';
// import IconButton from '@mui/material/IconButton';
// import LibraryBooksSharpIcon from '@mui/icons-material/LibraryBooksSharp';
// import { scanResult, resultsObj, panelCache } from '../../types';
// import ReadMeModal from './readMeModal';

// // displayNames, resultObj,

// export default function generateTabPanels(
//   displayNames: string[],
//   panelState: panelCache
// ) {
//   const [open, setOpen] = useState<boolean>(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   function getRandom() {
//     return Math.random() * 100;
//   }

//   const tabPanels = displayNames.map((extensionName, i: number) => {
//     let value = i.toString();
//     let content = `panelFor${extensionName}`;
//     const panel: scanResult = panelState[extensionName] || {
//       results: [{ funcName: 'no results yet', count: 0 }],
//     };

//     function gainedResult(array: resultsObj[]): React.ReactNode[] {
//       console.log('array within gainedResult: ', array);
//       const panelResults: React.ReactNode[] = array.map((funcObj) => {
//         return (
//           <div>
//             <strong>{funcObj.name}</strong> was found {funcObj.count} times.
//           </div>
//         );
//       });
//       return panelResults;
//     }

//     return (
//       <TabPanel value={value} key={getRandom()}>
//         {gainedResult(panel.results)}
//         <div>
//           <IconButton onClick={handleOpen}>
//             <Tooltip title='Learn about this Extension' placement='left-end'>
//               <LibraryBooksSharpIcon />
//             </Tooltip>
//           </IconButton>
//           <ReadMeModal handleClose={handleClose} open={open} />
//         </div>
//       </TabPanel>
//     );
//   });
//   return tabPanels;
// }

// module.exports = generateTabPanels;
