import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import FlashlightOnIcon from '@mui/icons-material/FlashlightOn';
import Skeleton from '@mui/material/Skeleton';

export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Skeleton />
      <AppBar position='static'>
        <Toolbar>
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
            SusCode
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

module.exports = NavBar;
//          <Button color='inherit'>Login</Button>
