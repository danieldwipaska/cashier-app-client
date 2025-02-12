import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { CardAction } from 'configs/utils';
import CustomCardFormValidation from 'lib/validations/CustomCardActionFormValidation';

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

export function ChildModal({ children, setError, data, action }: { children: any; setError: any; data: any; action: CardAction }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    const formValidation = new CustomCardFormValidation(data, action);

    const error = formValidation.validate();
    if (error?.isError) return setError(error.errors);

    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <button onClick={handleOpen} className="px-4 py-2 bg-green-500 hover:bg-green-600 duration-200 mt-4">
        Next
      </button>
      <Modal open={open} onClose={handleClose} aria-labelledby="child-modal-title" aria-describedby="child-modal-description">
        <Box sx={{ ...style, width: 450 }}>{children}</Box>
      </Modal>
    </React.Fragment>
  );
}

export function NestedModal({ children, open, handleClose, divClass }: { children: any; open: any; handleClose: any; divClass?: any }) {
  return (
    <div className={divClass}>
      <Modal open={open} onClose={handleClose} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={{ ...style, width: 400 }}>{children}</Box>
      </Modal>
    </div>
  );
}
