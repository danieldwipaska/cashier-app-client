import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { CircularProgress, TextField } from '@mui/material';
import SimpleSnackbar from '../snackbars/SimpleSnackbar';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CrewAuthAlertDialogSlide({
  openCrewAuthAlertDialog,
  setOpenCrewAuthAlertDialog,
  handleConfirm,
  crewCredential,
  setCrewCredential,
  errorCrewCredential,
  setErrorCrewCredential,
  errorUnauthorizedCrew,
  setErrorUnauthorizedCrew,
  isLoadingSubmitCrewCredential,
  setIsLoadingSubmitCrewCredential,
}: any) {
  const handleChangeCrewCredential = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCrewCredential(event.target.value);
  };
  const handleClose = () => {
    setCrewCredential('');
    setErrorCrewCredential(false);
    setErrorUnauthorizedCrew(false);
    setOpenCrewAuthAlertDialog(false);
    setIsLoadingSubmitCrewCredential(false);
  };

  return (
    <React.Fragment>
      <Dialog open={openCrewAuthAlertDialog} TransitionComponent={Transition} keepMounted onClose={handleClose} aria-describedby="alert-dialog-slide-description">
        <DialogTitle>{'Authentication'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">Enter your Crew Identity Code to continue!</DialogContentText>
          <TextField sx={{ mt: 1 }} type="password" id="standard" label="Password" variant="standard" fullWidth autoFocus color="success" value={crewCredential} onChange={handleChangeCrewCredential} error={errorCrewCredential} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant="contained" color="success">
            {isLoadingSubmitCrewCredential ? (
              <span className='flex gap-2 items-center'>
                Loading
                <CircularProgress color="warning" size={15} />
              </span>
            ) : (
              'Confirm'
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <SimpleSnackbar open={errorUnauthorizedCrew} setOpen={setErrorUnauthorizedCrew} message="Wrong Crew Identity Code!" />
    </React.Fragment>
  );
}
