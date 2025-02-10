import axios from 'axios';
import { ChildModal, NestedModal } from 'components/modals/Modal';
import { API_BASE_URL, CardAction } from 'configs/utils';
import { Card } from 'lib/interfaces/cards';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import formatNumber from 'functions/format.number';

const Adjust = ({ data, openAdjustModal, handleCloseAdjustModal, refetchCardData, setOpenBackdrop }: { data: Card; openAdjustModal: any; handleCloseAdjustModal: any; refetchCardData: any; setOpenBackdrop: any }) => {
  const { handleSubmit } = useForm();
  const [adjustedBalance, setAdjustedBalance] = useState(0);
  const [formattedAdjustedBalance, setFormattedAdjustedBalance] = useState<string>('');
  const [note, setNote] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<any>(null);
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChangeAdjustedBalance = (event: any) => {
    const input = event.target.value;
    const rawNumber = input.replace(/\./g, '');

    setFormattedAdjustedBalance(formatNumber(rawNumber));
    setAdjustedBalance(Number(rawNumber));
  };
  const handleChangeNote = (event: any) => {
    setNote(event.target.value);
  };
  const handleChangeCode = (event: any) => {
    setCode(event.target.value);
  };

  const onSubmit = async () => {
    const formData = {
      adjustedBalance,
      note,
      crewCode: code,
    };

    try {
      const response = await axios.patch(`${API_BASE_URL}/cards/${data?.id}/adjust`, formData);

      handleCloseAdjustModal();
      refetchCardData(response.data.data.card_number);
      resetAdjustData();

      setOpenBackdrop(true);
      setTimeout(() => {
        setOpenBackdrop(false);
      }, 3000);
    } catch (error) {
      handleClickSnackbar('Server Error');
    }
  };

  const resetAdjustData = () => {
    setAdjustedBalance(0);
    setNote('');
    setCode('');
    setError(null);
  };

  const handleClickSnackbar = (message: string) => {
    setServerErrorMessage(message);
    setOpenSnackbar(true);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  return (
    <>
      <NestedModal open={openAdjustModal} handleClose={handleCloseAdjustModal}>
        <div className="top-up-wrapper">
          <h1 className="text-lg font-semibold mb-5">Adjust</h1>
          <div className="grid grid-cols-2 items-center mb-4">
            <label className="" htmlFor="adjustedBalance">
              Balance
            </label>
            <input type="text" className="border px-3 py-2" id="adjustedBalance" value={formattedAdjustedBalance} onChange={handleChangeAdjustedBalance} placeholder="ex. 100000" required />
            <div></div>
            {error && <p className="text-red-500 text-xs">{error.adjustedBalance}</p>}
          </div>
          <div className="grid grid-cols-2 items-center mb-4">
            <label className="" htmlFor="note">
              Note
            </label>
            <input type="text" className="border px-3 py-2" id="note" value={note} onChange={handleChangeNote} placeholder="ex. udah langganan" />
            <div></div>
            {error && <p className="text-red-500 text-xs">{error.note}</p>}
          </div>
        </div>
        <ChildModal setError={setError} data={{ adjustedBalance, note }} action={CardAction.ADJUST}>
          <h1 className="text-lg font-semibold mb-5">Confirmation</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            {data?.customerId ? (
              <>
                <input type="hidden" value={data?.id} />
                <div className="grid grid-cols-2 items-center mb-4">
                  <label className="" htmlFor="customerName">
                    Name
                  </label>
                  <input type="text" className="border px-3 py-2 bg-gray-300" id="customerName" value={data?.customerName} placeholder="ex. 100000" required readOnly />
                </div>
                <div className="grid grid-cols-2 items-center mb-4">
                  <label className="" htmlFor="customerId">
                    Phone
                  </label>
                  <input type="text" className="border px-3 py-2 bg-gray-300" id="customerId" value={data?.customerId} placeholder="ex. 100000" required readOnly />
                </div>
              </>
            ) : null}
            <div className="grid grid-cols-2 items-center mb-4">
              <label className="" htmlFor="adjustedBalance">
                Balance
              </label>
              <input type="text" className="border px-3 py-2 bg-gray-300" id="adjustedBalance" value={formattedAdjustedBalance} required readOnly />
            </div>
            {note ? (
              <div className="grid grid-cols-2 items-center mb-4">
                <label className="" htmlFor="note">
                  Note
                </label>
                <textarea className="border px-3 py-2 bg-gray-300" id="note" required readOnly />
              </div>
            ) : null}
            <div className="grid grid-cols-2 items-center mb-4">
              <label className="" htmlFor="code">
                Code
              </label>
              <input type="password" className="border px-3 py-2" id="code" value={code} onChange={handleChangeCode} required />
            </div>
            <button type="submit" className="mt-5 px-4 py-2 bg-green-500 hover:bg-green-600">
              Submit
            </button>
          </form>
        </ChildModal>
      </NestedModal>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {serverErrorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Adjust;
