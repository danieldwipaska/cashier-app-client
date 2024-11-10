import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';

const PaymentMethod = () => {
  const [paymentMethod, setPaymentMethod] = React.useState('');
  const [paymentMethodSubmitIsSuccess, setPaymentMethodSubmitIsSuccess] = React.useState(false);

  // Payment Method Delete Dialog
  const [openPaymentMethodDialog, setOpenPaymentMethodDialog] = React.useState(false);
  const [deletedPaymentMethodId, setDeletedPaymentMethodId] = React.useState('');
  const [deletedPaymentMethodName, setDeletedPaymentMethodName] = React.useState('');

  const handleChangePaymentMethod = (event: any) => {
    setPaymentMethod(event.target.value);
  };

  const handleClosePaymentMethodDialog = () => {
    setOpenPaymentMethodDialog(false);
  };

  const handleClickOpenPaymentMethodDialog = (id: string, name: string) => {
    setDeletedPaymentMethodId(id);
    setDeletedPaymentMethodName(name);
    setOpenPaymentMethodDialog(true);
  };

  const { data: paymentMethods, refetch: paymentMethodsRefetch } = useQuery({
    queryKey: ['paymentMethods'],
    queryFn: () =>
      axios
        .get('http://localhost:3001/methods')
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  const deletePaymentMethod = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/methods/${id}`);

      paymentMethodsRefetch();
    } catch (error) {
      console.log(error);
    }
  };

  const addPaymentMethod = async () => {
    try {
      await axios.post(`http://localhost:3001/methods`, { name: paymentMethod });

      paymentMethodsRefetch();

      setPaymentMethod('');
      setPaymentMethodSubmitIsSuccess(true);
      setTimeout(() => {
        setPaymentMethodSubmitIsSuccess(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="overflow-y-auto h-1/3">
      <div>
        <div className=" border-b border-gray-300 py-1">
          <p className=" text-gray-500">Payment Method Management for Gift Card</p>
        </div>
        <div>
          <div className="mx-6 mt-4 flex">
            <div className="mr-2">
              <TextField id="outlined-basic" label="Name" variant="outlined" size="small" value={paymentMethod} onChange={handleChangePaymentMethod} />
            </div>
            <div className="mx-1">
              <Button variant="contained" color="success" onClick={addPaymentMethod}>
                Add
              </Button>
            </div>
            <div className="mx-2">
              {paymentMethodSubmitIsSuccess ? (
                <Stack spacing={0} sx={{ mx: 2 }}>
                  <Alert severity="success" sx={{ py: 0 }}>
                    added / updated
                  </Alert>
                </Stack>
              ) : null}
            </div>
          </div>
          <div className="flex">
            <div className="overflow-y-auto pl-2 mx-6 mt-4 " style={{ maxHeight: '250px' }}>
              <table className="table-auto">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="text-left ">
                    <th>No.</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody className="">
                  {paymentMethods?.map((method: any, i: number) => (
                    <tr className="hover:bg-gray-100 duration-200">
                      <td className="py-0 text-sm">{i + 1}</td>
                      <td className="py-0 px-4 text-sm">{method.name}</td>
                      <td className="py-0 px-4 text-sm">
                        <td className="py-0 px-4">
                          <button className="my-2 mx-1" onClick={() => handleClickOpenPaymentMethodDialog(method.id, method.name)}>
                            <FaTrash size={15} color="#DE4547" />
                          </button>
                        </td>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={openPaymentMethodDialog} onClose={handleClosePaymentMethodDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{'Warning!!!'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Are you sure to delete "{deletedPaymentMethodName}" from list of Payment Method?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentMethodDialog}>Cancel</Button>
          <Button
            onClick={() => {
              deletePaymentMethod(deletedPaymentMethodId);
              setOpenPaymentMethodDialog(false);
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PaymentMethod;
