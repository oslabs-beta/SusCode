import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CircularProgress from '@mui/material/CircularProgress';

function createRow(file: any, name: string, i: number) {
  const [open, setOpen] = React.useState(false);
  const inLoading = file?.stats?.malicious === undefined;
  const mali = inLoading ? <CircularProgress sx={{color:'#b3b3b5', size: '25'}}  /> : file?.stats?.malicious ?? 0;

  return (
      <React.Fragment key={i}>
    <TableRow sx={{borderBottom: 'none', paddingBottom: '2px'}}>
      <TableCell sx={{color: '#97D8C4', fontSize: '16px', borderBottom: 'none', paddingBottom: '3px'}} >{name}</TableCell>
      <TableCell align='left' sx={{color: file?.status === 'completed' ? '#97D8C4' : '#b3b3b5', borderBottom: 'none', paddingBottom: '3px',marginBottom: 'none', fontSize: '14px'}} >{file?.status || 'Scanning...'}</TableCell>
      <TableCell align='left' sx={{color: mali > 0 ? '#F56960' : '#97D8C4' , borderBottom: 'none', paddingBottom: '3px', width: 'auto', fontSize: '14px'}} >{mali}</TableCell>
      <TableCell sx={{borderBottom: 'none', paddingBottom: '3px'}}>
        {/* perhaps this below can be conditional if I find any errors. */}
        <IconButton onClick={() => setOpen(!open)}>
          {open ? <KeyboardArrowUpIcon sx={{color: '#b3b3b5'}} /> : <KeyboardArrowDownIcon sx={{color: mali > 0 ? '#F56960' : '#b3b3b5'}} />}
        </IconButton>
      </TableCell>
    </TableRow>
    <TableRow>
      <TableCell colSpan={3} sx={{
              // bgcolor: 'purple', 
              height: open ? 'auto' : '0',
              padding: open ? '8px' : '0',
              paddingTop: '0',
              marginTop: '0',
              borderBottom: 'none',
              overflow: 'hidden',
              transition: 'height 0.3s ease, padding 0.3s ease',
            }}>
        <Collapse in={open} sx={{
              margin: '0',
              borderBottom: 'none',
              // bgcolor: 'purple',
              padding: '1px',
            }}>
          {file?.stats?.malicious > 0 ? (            
            Object.entries(file.results).filter(([key, scan]:[string, any], index: number) =>  
              scan.category === 'malicious').map(([key, scan]:[string, any], index) => {
                return <Box key={index}><strong>{scan.engine_name}</strong> found {scan.category}: {scan.result}</Box>;
              })
          ) : (
            <Typography sx={{color: '#b3b3b5', fontSize: '14px', marginTop: 'none', paddingLeft: '20px', paddingTop: '0px'}}>No threats found</Typography> 
          )}
        </Collapse>
      </TableCell>
    </TableRow>
  </React.Fragment>
  );
}
export default function VirusTotalResults(props: any) { 
  const { VTResults, keyError } = props;
  console.log('these are the VTResults in virus total results: ', VTResults);

  if (!VTResults || Object.keys(VTResults).length === 0 || keyError === true) {
    return null;
  } else if (VTResults) {
    return (
      <TableContainer component={Paper} sx={{bgcolor: '#3D3D3D'}} >
        <Table aria-label="collapsible table" sx={{
            // '& .MuiTableRow-root': { height: '36px', margin: '0px'},
            // '& .MuiTableCell-root': { padding: '0px 4px', margin: '0px' },
          }}>
          <TableHead>
            <TableRow >
              {/* <TableCell /> */}
              <TableCell sx={{color: '#97D8C4', fontWeight: 'bold', fontSize: '20px'}}>File Name</TableCell>
              <TableCell sx={{color: '#97D8C4', fontWeight: 'bold', marginTop: '0px', fontSize: '20px'}} align="left">Status</TableCell>
              <TableCell sx={{color: '#97D8C4', fontWeight: 'bold', fontSize: '20px'}} align="left">Potential Threats Found</TableCell>
              {/* <TableCell align="right">Carbs&nbsp;(g)</TableCell>
              <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody >
            { Object.keys(VTResults).map((key, i)=> {
              return createRow(VTResults[key], key, i);
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
