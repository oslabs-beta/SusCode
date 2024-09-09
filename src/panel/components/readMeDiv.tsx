import * as React from 'react';
import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LibraryBooksSharpIcon from '@mui/icons-material/LibraryBooksSharp';
import ReadMeModal from './readMeModal';

export default function ReadMeDiv(props: any) {
  const [open, setOpen] = useState<boolean>(false);
  const { readMe } = props;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <IconButton onClick={handleOpen}>
        <Tooltip title='Learn about this Extension' placement='left-end'>
          <LibraryBooksSharpIcon />
        </Tooltip>
      </IconButton>
      <ReadMeModal handleClose={handleClose} open={open} readeMe={readMe} />
    </div>
  );
}

module.exports = ReadMeDiv;
