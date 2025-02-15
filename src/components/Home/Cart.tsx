import { useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { FiSave } from 'react-icons/fi';
import { VscNewFile } from 'react-icons/vsc';
import { Alert, CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import axios from 'axios';
import CrewAuthAlertDialogSlide from './CrewAuthAlertDialogSlide';
import SimpleSnackbar from '../snackbars/SimpleSnackbar';
import { ReportStatus, ReportType } from 'configs/utils';
import ICartProps from 'interfaces/CartProps';

const Cart = ({ actionData, orderData, states, crewData, unpaidReports, calculationData }: ICartProps) => {
  // START STATES
  const { setCardId, cardNumber, setCardNumber, customerName, setCustomerId, setCustomerName, paymentMethod, setPaymentMethod, note, setNote, openBill, setOpenBill } = actionData;
  const { orders, setOrders } = orderData;
  const { setOpenSummary } = states;
  const { crewCredential, setCrewCredential, openCrewAuthAlertDialog, setOpenCrewAuthAlertDialog, errorCrewCredential, setErrorCrewCredential, errorUnauthorizedCrew, setErrorUnauthorizedCrew } = crewData;
  const { reports, reportsRefetch } = unpaidReports;
  const { totalOrder, totalTaxService } = calculationData;

  const [customerNameIsEmpty, setCustomerNameIsEmpty] = useState(false);
  const [paymentMethodIsEmpty, setPaymentMethodIsEmpty] = useState(false);
  const [cardNumberIsEmpty, setCardNumberIsEmpty] = useState(false);
  const [orderIsEmpty, setOrderIsEmpty] = useState(false);

  const [openConfirmProgressSpinner, setOpenConfirmProgressSpinner] = useState(false);
  const [openSaveProgressSpinner, setOpenSaveProgressSpinner] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // END STATES

  // START FUNCTIONS
  const handleClickNewOrder = () => {
    setCardNumber('');
    setCustomerName('');
    setCustomerId('');
    setPaymentMethod('');
    setNote('');
    setOrders([]);
    setCrewCredential('');
    return;
  };

  const handleChangeOpenBill = async (event: any) => {
    setOpenBill(event.target.value);

    if (!event.target.value) {
      setCardNumber('');
      setCustomerName('');
      setCustomerId('');
      setPaymentMethod('');
      setNote('');
      setOrders([]);
      setCrewCredential('');
      return;
    }

    try {
      const res = await axios.get(`http://localhost:3001/reports/${event.target.value}`);

      setCardNumber(res.data.data.card_number);
      setCustomerName(res.data.data.customer_name);
      setCustomerId(res.data.data.customer_id);
      setPaymentMethod(res.data.data.payment_method);
      setNote(res.data.data.note);

      const ordersData: any = [];
      res.data.data.order_id.forEach((orderId: any, i: number) => {
        const order = {
          id: orderId,
          name: res.data.data.order_name[i],
          category: {
            name: res.data.data.order_category[i],
          },
          price: res.data.data.order_price[i],
          discount_status: res.data.data.order_discount_status[i],
          discount_percent: res.data.data.order_discount_percent[i],
          amount: res.data.data.order_amount[i],
        };

        ordersData.push(order);
      });

      setOrders(ordersData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickOpenCrewAuthAlertDialog = () => {
    if (!customerName) return setCustomerNameIsEmpty(true);
    setOpenCrewAuthAlertDialog(true);
  };

  const handleCardNumberChange = (event: any) => {
    setCardNumberIsEmpty(false);
    setCardNumber(event.target.value);
  };

  const increaseAmount = (id: number) => {
    orders?.forEach((order: any) => {
      if (order.id === id) {
        order.amount++;
        setOrders([...orders]);
      }
    });
  };

  const decreaseAmount = (id: number) => {
    orders?.forEach((order: any) => {
      if (order.id === id) {
        order.amount--;
        setOrders([...orders]);

        if (order.amount <= 0) {
          const newOrders = orders?.filter((order: any) => order.id !== id);
          setOrders([...newOrders]);
        }
      }
    });
  };

  const handleCustomerNameChange = (event: any) => {
    setCustomerNameIsEmpty(false);
    setCustomerName(event.target.value);
  };

  const handlePaymentMethodChange = (event: SelectChangeEvent) => {
    setPaymentMethod(event.target.value);
  };

  const handleNoteChange = (event: any) => {
    setNote(event.target.value);
  };

  const handleSave = async () => {
    setOpenSaveProgressSpinner(true);
    if (!crewCredential) return setErrorCrewCredential(true);

    try {
      const crew = await axios.post(`http://localhost:3001/crews/code`, { code: crewCredential });
      if (!crew.data.data) return setErrorUnauthorizedCrew(true);

      const order_id: string[] = [];
      const order_name: string[] = [];
      const order_category: string[] = [];
      const order_amount: number[] = [];
      const order_price: number[] = [];
      const order_discount_status: boolean[] = [];
      const order_discount_percent: number[] = [];

      orders.forEach((order: any) => {
        order_id.push(order.id);
        order_name.push(order.name);
        order_category.push(order.category.name);
        order_amount.push(order.amount);
        order_price.push(order.price);
        order_discount_status.push(order.discount_status);
        order_discount_percent.push(order.discount_percent);
      });

      const payload = {
        type: ReportType.PAY,
        status: ReportStatus.UNPAID,
        customer_name: customerName,
        crew_id: crew.data.data.id,
        payment_method: paymentMethod,
        order_id,
        order_amount,
        card_number: cardNumber || null,
        note: note || null,
      };

      try {
        await axios.post('http://localhost:3001/reports', payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        });

        setOrders([]);
        setCustomerName('');
        setCustomerId('');
        setPaymentMethod('');
        setNote('');
        setOpenBill('');
        setErrorCrewCredential(false);
        setErrorUnauthorizedCrew(false);
        setCrewCredential('');

        setOpenCrewAuthAlertDialog(false);
        setOpenSaveProgressSpinner(false);
        reportsRefetch();
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirm = async () => {
    if (orders.length === 0) {
      setOrderIsEmpty(true);
      setTimeout(() => {
        setOrderIsEmpty(false);
      }, 3000);
    } else if (!customerName && paymentMethod !== 'Gift Card') {
      setCustomerNameIsEmpty(true);
    } else if (!cardNumber && paymentMethod === 'Gift Card') {
      setCardNumberIsEmpty(true);
    } else if (!paymentMethod) {
      setPaymentMethodIsEmpty(true);
    } else {
      if (paymentMethod === 'Gift Card') {
        setOpenConfirmProgressSpinner(true);
        try {
          const response = await axios.get(`http://localhost:3001/cards/${cardNumber}`);
          if (response.data.data.balance < totalOrder + totalTaxService) throw new Error('Balance Not Enough');

          // setCardNumber(response.data.data.card_number);
          setCustomerName(response.data.data.customer_name);
          setCustomerId(response.data.data.customer_id);
          setCardId(response.data.data.id);
          setOpenSummary(true);
          setOpenConfirmProgressSpinner(false);
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            if (error?.response?.data?.statusCode === 404) setSnackbarMessage('Invalid Card Number');
            if (error?.response?.data?.statusCode === 500) setSnackbarMessage('Server Error');
            if (error?.response?.data?.statusCode === 400) setSnackbarMessage(error.response.data.message);
          } else if (error instanceof Error) {
            setSnackbarMessage(error.message);
          } else {
            setSnackbarMessage('Unknown Error');
            console.log(error);
          }

          setOpenSnackbar(true);
          setOpenConfirmProgressSpinner(false);
        }
      } else {
        setOpenSummary(true);
      }
    }
  };

  // END FUNCTIONS

  return (
    <div className="h-screen w-4/12 pt-20 mx-8">
      <div className="grid grid-cols-1 content-between h-full">
        <div className="h-full">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold ">Your Order</p>
            </div>
            <div className="flex items-center">
              <div className="flex place-content-center">
                <button onClick={handleClickNewOrder} className=" hover:opacity-30 duration-300">
                  <VscNewFile size={30} color="3F3E3E" />
                </button>
              </div>
              <FormControl sx={{ ml: 2, minWidth: 120 }} size="small">
                <Select value={openBill} onChange={handleChangeOpenBill} displayEmpty inputProps={{ 'aria-label': 'Without label' }}>
                  <MenuItem value="">New</MenuItem>
                  {reports?.map((report: any) => (
                    <MenuItem value={report.id}>
                      OpenBill-{report.customer_name}-{report.served_by}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="mt-2">
            <p className="font-normal">Menu Detail</p>
          </div>

          {orderIsEmpty ? (
            <div className="mt-4">
              <Alert severity="error">Your Order cannot be empty.</Alert>
            </div>
          ) : null}

          <div className="flex flex-col overflow-y-auto thin-scrollbar mt-2 pr-2 h-60 2xl:h-96">
            {orders?.map((order: any) => (
              <div className="mt-5 border-b-2 pb-2" key={order.id}>
                <div className="flex justify-between items-center">
                  <div className="mr-2">
                    <p className="text-sm">{order.name}</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      className=" bg-green-500 hover:opacity-70 duration-500 p-2 rounded-md"
                      onClick={() => {
                        decreaseAmount(order.id);
                      }}
                    >
                      <FaMinus size={10} color="#000000" />
                    </button>
                    <div className="mx-1">
                      <input type="text" className="text-xs text-center text-black/60 py-1 px-2 rounded-md border border-black/25 max-w-8" readOnly value={order.amount} />
                    </div>
                    <button
                      className=" bg-green-500 hover:opacity-70 duration-500 p-2 rounded-md"
                      onClick={() => {
                        increaseAmount(order.id);
                      }}
                    >
                      <FaPlus size={10} color="#000000" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between mt-2">
                  <div></div>
                  {order.discount_status ? (
                    <div className="flex items-center">
                      <p className="text-sm text-orange-500 mr-1">(-{order.discount_percent}%)</p>
                      <p className="text-sm">{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(order.price * order.amount - (order.price * order.amount * order.discount_percent) / 100)}</p>
                    </div>
                  ) : (
                    <div className="">
                      <p className="text-sm">{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(order.price * order.amount)}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div>
            <div className="mb-5 grid grid-cols-2 gap-2">
              <FormControl sx={{ mb: 1, minWidth: 120 }} size="small">
                {paymentMethodIsEmpty ? (
                  <InputLabel id="demo-select-small-label" error>
                    Payment
                  </InputLabel>
                ) : (
                  <InputLabel id="demo-select-small-label">Payment</InputLabel>
                )}

                {paymentMethodIsEmpty ? (
                  <Select labelId="demo-select-small-label" id="demo-select-small" label="Payment" value={paymentMethod} onChange={handlePaymentMethodChange} error>
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Gift Card">Gift Card</MenuItem>
                  </Select>
                ) : (
                  <Select labelId="demo-select-small-label" id="demo-select-small" label="Payment" value={paymentMethod} onChange={handlePaymentMethodChange}>
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Gift Card">Gift Card</MenuItem>
                  </Select>
                )}
              </FormControl>

              {paymentMethod === 'Gift Card' ? (
                <FormControl size="small" sx={{ m: 0, minWidth: 120 }}>
                  {cardNumberIsEmpty ? (
                    <TextField id="card-number" error label="Card" variant="outlined" size="small" onChange={handleCardNumberChange} value={cardNumber} />
                  ) : (
                    <TextField id="card-number" label="Card" variant="outlined" size="small" onChange={handleCardNumberChange} value={cardNumber} />
                  )}
                </FormControl>
              ) : (
                <FormControl size="small" sx={{ m: 0, minWidth: 120 }}>
                  {customerNameIsEmpty ? (
                    <TextField id="customer-name" error label="Customer Name" variant="outlined" size="small" onChange={handleCustomerNameChange} value={customerName} />
                  ) : (
                    <TextField id="customer-name" label="Customer Name" variant="outlined" size="small" onChange={handleCustomerNameChange} value={customerName} />
                  )}
                </FormControl>
              )}

              <FormControl size="small" sx={{ mt: 0, minWidth: 120 }}>
                <TextField id="note" label="Note" variant="outlined" size="small" onChange={handleNoteChange} value={note} />
              </FormControl>
            </div>
            <div className="flex justify-between">
              <div>
                <p>Total</p>
              </div>
              <div>
                <div className="flex text-black/60">
                  <p className="mx-2">{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalOrder + totalTaxService)}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex py-2">
            <button
              className={`text-center my-2 mr-2 py-1 px-3 border border-black/60 duration-500 rounded-lg ${paymentMethod === 'Gift Card' || !paymentMethod || openBill ? 'opacity-30' : 'hover:border-green-500 hover:bg-green-500'}`}
              onClick={handleClickOpenCrewAuthAlertDialog}
              disabled={paymentMethod === 'Gift Card' || !paymentMethod || openBill ? true : false}
            >
              {openSaveProgressSpinner ? <CircularProgress color="secondary" size={15} /> : <FiSave size={25} color="#3F3E3E" />}
            </button>

            <button className="text-center w-full my-2 py-2 bg-green-500 hover:opacity-70 duration-500 rounded-lg" onClick={handleConfirm}>
              {openConfirmProgressSpinner ? <CircularProgress color="secondary" size={15} /> : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
      <CrewAuthAlertDialogSlide
        openCrewAuthAlertDialog={openCrewAuthAlertDialog}
        setOpenCrewAuthAlertDialog={setOpenCrewAuthAlertDialog}
        handleConfirm={handleSave}
        crewCredential={crewCredential}
        setCrewCredential={setCrewCredential}
        errorCrewCredential={errorCrewCredential}
        setErrorCrewCredential={setErrorCrewCredential}
        errorUnauthorizedCrew={errorUnauthorizedCrew}
        setErrorUnauthorizedCrew={setErrorUnauthorizedCrew}
      />
      <SimpleSnackbar open={openSnackbar} setOpen={setOpenSnackbar} message={snackbarMessage} />
    </div>
  );
};

export default Cart;
