import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect } from 'react';

const updateModalStyle = {
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

const UpdateModal = ({
  openUpdateModal,
  setOpenUpdateModal,
  setSubmitIsSuccess,
  refetch,
  updatedId,
  setUpdatedId,
  updatedName,
  setUpdatedName,
  updatedCode,
  setUpdatedCode,
  updatedPosition,
  setUpdatedPosition,
}: {
  openUpdateModal: any;
  setOpenUpdateModal: any;
  setSubmitIsSuccess: any;
  refetch: any;
  updatedId: any;
  setUpdatedId: any;
  updatedName: any;
  setUpdatedName: any;
  updatedCode: any;
  setUpdatedCode: any;
  updatedPosition: any;
  setUpdatedPosition: any;
}) => {
  const handleChangeNameUpdated = (event: any) => {
    setUpdatedName(event.target.value);
  };

  const handleChangeCodeUpdated = (event: any) => {
    setUpdatedCode(event.target.value);
  };

  const handleChangePositionUpdated = (event: any) => {
    setUpdatedPosition(event.target.value);
  };

  const handleCloseUpdateModal = () => setOpenUpdateModal(false);

  const update = async () => {
    try {
      await axios.patch(`http://localhost:3001/crews/${updatedId}`, { name: updatedName, code: updatedCode, position: updatedPosition });

      refetch();
      setSubmitIsSuccess(true);
      setTimeout(() => {
        setSubmitIsSuccess(false);
      }, 2000);

      handleCloseUpdateModal();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Modal open={openUpdateModal} onClose={handleCloseUpdateModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={updateModalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Crew
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <div className="my-3">
              <TextField id="outlined-basic" label="Name" variant="outlined" size="small" onChange={handleChangeNameUpdated} value={updatedName} />
            </div>
            <div className="my-3">
              <TextField id="outlined-basic" label="Code" variant="outlined" size="small" onChange={handleChangeCodeUpdated} value={updatedCode} />
            </div>
            <div className="my-3">
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel id="demo-select-small-label">Position</InputLabel>
                <Select labelId="demo-select-small-label" id="demo-select-small" value={updatedPosition} label="Position" onChange={handleChangePositionUpdated}>
                  <MenuItem value="server">Server</MenuItem>
                  <MenuItem value="bartender">Bartender</MenuItem>
                </Select>
              </FormControl>
            </div>
          </Typography>
          <Typography id="modal-modal-footer" sx={{ mt: 4 }}>
            <div className="flex justify-end">
              <div>
                <Button variant="contained" color="inherit" sx={{ mx: 1 }} onClick={handleCloseUpdateModal}>
                  Cancel
                </Button>
                <Button variant="contained" color="success" onClick={update}>
                  Submit
                </Button>
              </div>
            </div>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default UpdateModal;
