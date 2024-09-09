import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FlashlightOnIcon from '@mui/icons-material/FlashlightOn';
import Skeleton from '@mui/material/Skeleton';

export default function NavBar() {
  const styles = {
    customizeToolbar: {
      minHeight: 36,
    },
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Skeleton />
      <AppBar position='static'>
        <Toolbar variant='dense' sx={{ color: '#cccccc' }}>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
          >
            <FlashlightOnIcon />
          </IconButton>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            SusCode Extension Scan Results
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

module.exports = NavBar;
//          <Button color='inherit'>Login</Button>
