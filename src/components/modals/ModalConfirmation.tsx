import { Box, Button, Modal } from '@mui/material';
import React, { useState } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const ModalConfirmation = ({ children, buttonContent, confirm }: { children: any; buttonContent: any; confirm: any }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleConfirm = () => {
    confirm();
  };

  return (
    <React.Fragment>
      {typeof buttonContent === 'string' ? (
        <Button variant="contained" onClick={handleOpen} color="success">
          {buttonContent}
        </Button>
      ) : (
        <button onClick={handleOpen}>{buttonContent}</button>
      )}

      <Modal open={open} onClose={handleClose} aria-labelledby="child-modal-title" aria-describedby="child-modal-description">
        <Box sx={{ ...style, width: 450 }}>
          {children}
          <div className="flex justify-end gap-2 mt-5">
            <Button variant="contained" color="success" onClick={handleConfirm}>
              Confirm
            </Button>
            <Button variant="contained" color="error" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default ModalConfirmation;
