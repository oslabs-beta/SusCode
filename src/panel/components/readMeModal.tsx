import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

export default function ReadMeModal(props: any) {
  const { handleClose, open, readMe } = props;

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <Typography id='modal-modal-title' variant='h6' component='h2'>
          Extension Description for {readMe.name}:
        </Typography>
        <Typography id='modal-modal-description' sx={{ mt: 2 }}>
          {readMe.description}
        </Typography>
      </Box>
    </Modal>
  );
}

module.exports = ReadMeModal;