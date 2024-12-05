// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Modal from '@mui/material/Modal';
// import Link from '@mui/material/Link';

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };

// export default function ApiTransparencyModal() {
//   const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   return (
//     <div>
//       <Button onClick={handleOpen}>Open modal</Button>
//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={style}>
//           <Typography id="modal-modal-title" variant="h6" component="h2">
//             Where are we storing the API key?
//           </Typography>
//           <Typography id="modal-modal-description" sx={{ mt: 2 }}>
//             The VS Code API has a Secret Storage functionality that can store things in a safe manner so as not to be spreading your api key around the internet. The VS Code Secret Storage docs are located <Link href="https://code.visualstudio.com/api/references/vscode-api#SecretStorage">HERE</Link>
//           </Typography>
//         </Box>
//       </Modal>
//     </div>
//   );
// }