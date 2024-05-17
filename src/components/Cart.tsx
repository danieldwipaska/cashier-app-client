import React, { useState } from 'react';
import { IoFastFoodOutline } from 'react-icons/io5';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { Alert, CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import axios from 'axios';

const Cart = (props: any) => {
  const { setCardId, cardNumber, setCardNumber, orders, setOrders, customerName, setCustomerId, setCustomerName, paymentMethod, setPaymentMethod, note, setNote, setOpenSummary, totalOrder, setTotalOrder } = props;

  const [customerNameIsEmpty, setCustomerNameIsEmpty] = useState(false);
  const [paymentMethodIsEmpty, setPaymentMethodIsEmpty] = useState(false);
  const [cardNumberIsEmpty, setCardNumberIsEmpty] = useState(false);
  const [orderIsEmpty, setOrderIsEmpty] = useState(false);

  const [openConfirmProgressSpinner, setOpenConfirmProgressSpinner] = useState(false);

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

          // setCardNumber(response.data.data.card_number);
          setCustomerName(response.data.data.customer_name);
          setCustomerId(response.data.data.customer_id);
          setCardId(response.data.data.id);
          setOpenSummary(true);
          setOpenConfirmProgressSpinner(false);
        } catch (error) {
          console.log(error);
        }
      } else {
        setOpenSummary(true);
      }
    }
  };

  return (
    <div className="h-screen w-3/12 pt-20 mx-8">
      <div className="grid grid-cols-1 content-between h-full">
        <div className="h-full">
          <div>
            <p className="text-lg font-semibold">Your Order</p>
          </div>
          <div className="mt-2">
            <p className="font-normal">Menu Detail</p>
          </div>

          {orderIsEmpty ? (
            <div className="mt-4">
              <Alert severity="error">Your Order cannot be empty.</Alert>
            </div>
          ) : null}

          <div className="flex flex-col overflow-y-auto mt-2 h-60 2xl:h-96">
            {orders?.map((order: any) => (
              <div className="flex items-center mt-5">
                <div>
                  <div className="bg-slate-800 p-2 rounded-lg">
                    <IoFastFoodOutline size={40} color="#ffffff" />
                  </div>
                </div>
                <div className="mx-3">
                  <div>
                    <p className="text-sm">{order.name}</p>
                  </div>
                  <div className="flex items-center mt-2">
                    <button
                      className=" bg-green-500 hover:opacity-70 duration-500 p-2 rounded-md"
                      onClick={() => {
                        decreaseAmount(order.id);
                      }}
                    >
                      <FaMinus size={10} color="#000000" />
                    </button>
                    <div className="mx-1">
                      <input type="text" className="text-xs text-center text-black/60 py-1 px-2 rounded-md border border-black/25" readOnly value={order.amount} />
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
                    <TextField id="outlined-basic" error label="Card" variant="outlined" size="small" onChange={handleCardNumberChange} value={cardNumber} />
                  ) : (
                    <TextField id="outlined-basic" label="Card" variant="outlined" size="small" onChange={handleCardNumberChange} value={cardNumber} />
                  )}
                </FormControl>
              ) : (
                <FormControl size="small" sx={{ m: 0, minWidth: 120 }}>
                  {customerNameIsEmpty ? (
                    <TextField id="outlined-basic" error label="Customer Name" variant="outlined" size="small" onChange={handleCustomerNameChange} value={customerName} />
                  ) : (
                    <TextField id="outlined-basic" label="Customer Name" variant="outlined" size="small" onChange={handleCustomerNameChange} value={customerName} />
                  )}
                </FormControl>
              )}

              <FormControl size="small" sx={{ mt: 0, minWidth: 120 }}>
                <TextField id="outlined-basic" label="Note" variant="outlined" size="small" onChange={handleNoteChange} value={note} />
              </FormControl>
            </div>
            <div className="flex justify-between">
              <div>
                <p>Total</p>
              </div>
              <div>
                <div className="flex text-black/60">
                  <p>IDR</p>
                  <p className="mx-2">{Intl.NumberFormat('en-us').format(totalOrder)}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <button className="text-center w-full my-6 py-2 bg-green-500 hover:opacity-70 duration-500 rounded-lg" onClick={handleConfirm}>
              {openConfirmProgressSpinner ? <CircularProgress color="secondary" size={15} /> : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
