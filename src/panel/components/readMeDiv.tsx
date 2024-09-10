import * as React from 'react';
import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LibraryBooksSharpIcon from '@mui/icons-material/LibraryBooksSharp';
import ReadMeModal from './readMeModal';
import { Typography } from '@mui/material';

export default function ReadMeDiv(props: any) {
  const [open, setOpen] = useState<boolean>(false);
  const { readMe, extensionName } = props;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <IconButton onClick={handleOpen}>
        <Tooltip
          title='Learn about this Extension'
          placement='left-end'
          color='primary'
        >
          <LibraryBooksSharpIcon />
        </Tooltip>
        <Typography sx={{ textDecorationColor: 'primary' }}>
          App Description
        </Typography>
      </IconButton>
      <ReadMeModal
        handleClose={handleClose}
        open={open}
        readMe={readMe}
        extensionName={extensionName}
      />
    </div>
  );
}

module.exports = ReadMeDiv;
