import React, { useState } from 'react';
import { BsArrowRightSquareFill, BsBoxArrowUpRight } from 'react-icons/bs';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { HiOutlineAdjustments } from 'react-icons/hi';
import { MdCancel } from 'react-icons/md';
import { IoIosArrowBack } from 'react-icons/io';
import axios from 'axios';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

const CardAction = () => {
  const [openCardDetails, setOpenCardDetails] = useState(false);
  const [action, setAction] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardData, setCardData] = useState<any>(null);
  const [cardTransactions, setCardTransactions] = useState<any>([]);

  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [addBalance, setAddBalance] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [note, setNote] = useState('');
  const [adjustedBalance, setAdjustedBalance] = useState(0);

  const [customerNameIsEmpty, setCustomerNameIsEmpty] = useState(false);
  const [customerIdIsEmpty, setCustomerIdIsEmpty] = useState(false);
  const [paymentMethodIsEmpty, setPaymentMethodIsEmpty] = useState(false);
  const [addBalanceIsEmpty, setAddBalanceIsEmpty] = useState(false);
  const [adjustedBalanceIsEmpty, setAdjustedBalanceIsEmpty] = useState(false);

  const { data: paymentMethodData, refetch: paymentMethodDataRefetch } = useQuery({
    queryKey: ['paymentMethodData'],
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

  const handleOpenCardDetails = async () => {
    try {
      const card = await axios.get(`http://localhost:3001/cards/${cardNumber}`);

      try {
        const transactions = await axios.get(`http://localhost:3001/reports/transactions/${card.data.data.card_number}?customer_id=${card.data.data.customer_id}`);

        setCardData(card.data.data);
        setCardTransactions(transactions.data.data);

        setOpenCardDetails(true);
        setAction('');
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  interface Data {
    id: string;
    card_number: string;
    customer_id: string;
    customer_name: string;
    balance: number;
    status: 'active' | 'inactive' | 'blocked';
    is_member: boolean;
    created_at: Date;
    updated_at: Date;
  }

  const handleTopupAction = () => {
    setAction('topup');
  };

  const handleCheckoutAction = () => {
    setAction('checkout');
  };

  const handleAdjustAction = () => {
    setAction('adjust');
  };

  const handleBack = () => {
    setAction('');
  };

  const handleCardNumberChange = (event: any) => {
    setCardNumber(event.target.value);
  };

  const handleChangeCustomerName = (event: any) => {
    setCustomerNameIsEmpty(false);
    setCustomerName(event.target.value);
  };

  const handleChangeCustomerId = (event: any) => {
    setCustomerIdIsEmpty(false);
    setCustomerId(event.target.value);
  };

  const handleChangeAddBalance = (event: any) => {
    setAddBalanceIsEmpty(false);
    setAddBalance(event.target.value);
  };

  const handleChangePaymentMethod = (event: any) => {
    setPaymentMethodIsEmpty(false);
    setPaymentMethod(event.target.value);
  };

  const handleChangeNote = (event: any) => {
    setNote(event.target.value);
  };

  const handleChangeAdjustedBalance = (event: any) => {
    setAdjustedBalanceIsEmpty(false);
    setAdjustedBalance(event.target.value);
  };

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      handleOpenCardDetails();
    }
  };

  const topUpAndActivate = async (id: string) => {
    if (!customerName) return setCustomerNameIsEmpty(true);
    if (!customerId) return setCustomerIdIsEmpty(true);
    if (!paymentMethod) return setPaymentMethodIsEmpty(true);
    if (!addBalance) return setAddBalanceIsEmpty(true);

    try {
      const data = {
        customerId,
        customerName,
        addBalance,
        paymentMethod,
        note,
      };

      await axios.patch(`http://localhost:3001/cards/${id}/topup/activate`, data);

      setCustomerName('');
      setCustomerId('');
      setAddBalance(0);
      setPaymentMethod('');
      setNote('');
      await handleOpenCardDetails();
    } catch (error) {
      console.log(error);
    }
  };

  const topUpCardBalance = async (id: string) => {
    if (!addBalance) return setAddBalanceIsEmpty(true);
    if (!paymentMethod) return setPaymentMethodIsEmpty(true);

    try {
      const data = {
        addBalance,
        paymentMethod,
        note,
      };

      await axios.patch(`http://localhost:3001/cards/${id}/topup`, data);

      setAddBalance(0);
      setPaymentMethod('');
      setNote('');
      await handleOpenCardDetails();
    } catch (error) {
      console.log(error);
    }
  };

  const checkoutCard = async (id: string) => {
    if (!paymentMethod) return setPaymentMethodIsEmpty(true);

    try {
      const data = {
        paymentMethod,
        note,
      };

      await axios.patch(`http://localhost:3001/cards/${id}/checkout`, data);

      setPaymentMethod('');
      setNote('');
      await handleOpenCardDetails();
    } catch (error) {
      console.log(error);
    }
  };

  const adjustCardBalance = async (id: string) => {
    if (!adjustedBalance) return setAdjustedBalanceIsEmpty(true);

    try {
      const data = {
        adjustedBalance,
      };

      await axios.patch(`http://localhost:3001/cards/${id}/adjust`, data);

      setAdjustedBalance(0);
      setNote('');
      await handleOpenCardDetails();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-200 max-h-screen pt-20 px-8 w-11/12">
      <div className="bg-white mt-2 py-5 px-6 rounded-md" style={{ maxHeight: '92%' }}>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="flex justify-between items-center">
              <div>
                <h3>Gift Card</h3>
              </div>
              <div className="flex items-center">
                <div>
                  <input type="text" className="border border-black/40 py-1 px-2 rounded-md" placeholder="Enter Card Number" value={cardNumber} onChange={handleCardNumberChange} onKeyUp={handleKeyPress} />
                </div>
                <button className="ml-1" onClick={handleOpenCardDetails}>
                  <BsArrowRightSquareFill size={32} />
                </button>
              </div>
            </div>
            {openCardDetails ? (
              <div>
                <div className="flex justify-center mt-7">
                  <div className="bg-black/80 shadow-2xl h-48 w-80 text-white p-6 rounded-xl">
                    <div>
                      <h4>Basic Card</h4>
                    </div>
                    <div className="mt-2">
                      <p className="font-serif text-sm">{cardData ? cardData.customer_name : 'New Card'}</p>
                    </div>
                    <div>
                      <p className="font-serif text-sm">{cardData ? cardData.customer_id : 'New Card'}</p>
                    </div>
                    <div className=" mt-10">
                      <p className="text-end mr-3">{cardData ? cardData.card_number : '0000000000'}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-7">
                  {cardData?.status === 'active' ? (
                    <button className=" w-full bg-gray-600 rounded-lg px-5 pt-3 pb-4 hover:opacity-80 duration-300" onClick={handleTopupAction}>
                      <div className="flex">
                        <div className="bg-gray-500 rounded-full mt-2 shadow-lg p-2">
                          <FaArrowTrendUp color="#ffffff" size={20} />
                        </div>
                      </div>
                      <div className="flex mt-2">
                        <div>
                          <h4 className="text-white">Top-Up Card</h4>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <button className=" w-full bg-gray-600 rounded-lg px-5 pt-3 pb-4 hover:opacity-80 duration-300" onClick={handleTopupAction}>
                      <div className="flex">
                        <div className="bg-gray-500 rounded-full mt-2 shadow-lg p-2">
                          <FaArrowTrendUp color="#ffffff" size={20} />
                        </div>
                      </div>
                      <div className="flex mt-2">
                        <div>
                          <h4 className="text-white">Top-Up & Activate</h4>
                        </div>
                      </div>
                    </button>
                  )}
                  {cardData?.status === 'active' ? (
                    <button className=" w-full bg-black/50 rounded-lg px-5 pt-3 pb-4 hover:opacity-80 duration-300">
                      <div className="flex">
                        <div className="bg-gray-600 rounded-full mt-2 shadow-lg p-2">
                          <BsBoxArrowUpRight color="#ffffff" size={20} />
                        </div>
                      </div>
                      <div className="flex mt-2">
                        <div>
                          <h4 className="text-white">Transfer Card</h4>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <button className=" w-full bg-black/50 rounded-lg px-5 pt-3 pb-4 opacity-30" disabled>
                      <div className="flex">
                        <div className="bg-gray-600 rounded-full mt-2 shadow-lg p-2">
                          <BsBoxArrowUpRight color="#ffffff" size={20} />
                        </div>
                      </div>
                      <div className="flex mt-2">
                        <div>
                          <h4 className="text-white">Transfer Card</h4>
                        </div>
                      </div>
                    </button>
                  )}
                  {cardData?.status === 'active' ? (
                    <button className=" w-full bg-black/60 rounded-lg px-5 pt-3 pb-4 hover:opacity-80 duration-300" onClick={handleAdjustAction}>
                      <div className="flex">
                        <div className="bg-gray-500 rounded-full mt-2 shadow-lg p-2">
                          <HiOutlineAdjustments color="#ffffff" size={20} />
                        </div>
                      </div>
                      <div className="flex mt-1">
                        <div>
                          <h4 className="text-white">Adjust Balance</h4>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <button className=" w-full bg-black/60 rounded-lg px-5 pt-3 pb-4 opacity-30" disabled>
                      <div className="flex">
                        <div className="bg-gray-500 rounded-full mt-2 shadow-lg p-2">
                          <HiOutlineAdjustments color="#ffffff" size={20} />
                        </div>
                      </div>
                      <div className="flex mt-1">
                        <div>
                          <h4 className="text-white">Adjust Balance</h4>
                        </div>
                      </div>
                    </button>
                  )}
                  {cardData?.status === 'active' ? (
                    <button className=" w-full bg-red-600/80 rounded-lg px-5 pt-3 pb-4 hover:opacity-80 duration-300" onClick={handleCheckoutAction}>
                      <div className="flex">
                        <div className="bg-red-600 rounded-full mt-2 shadow-lg p-2">
                          <MdCancel color="#ffffff" size={20} />
                        </div>
                      </div>
                      <div className="flex mt-1">
                        <div>
                          <h4 className="text-white">Checkout Card</h4>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <button className=" w-full bg-red-600/80 rounded-lg px-5 pt-3 pb-4 opacity-30" disabled>
                      <div className="flex">
                        <div className="bg-red-600 rounded-full mt-2 shadow-lg p-2">
                          <MdCancel color="#ffffff" size={20} />
                        </div>
                      </div>
                      <div className="flex mt-1">
                        <div>
                          <h4 className="text-white">Checkout Card</h4>
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
          {openCardDetails && !action ? (
            <div>
              <div className="flex justify-end items-center mt-1">
                <div>
                  <h3>IDR {Intl.NumberFormat('en-us').format(cardData?.balance)}</h3>
                </div>
              </div>
              <div className="flex mt-2">
                <div>
                  <h4>Transactions</h4>
                </div>
              </div>
              <div className="flex flex-col overflow-y-auto" style={{ maxHeight: '300px' }}>
                {cardTransactions?.map((transaction: any) => (
                  <div className="flex mt-2 border-b-2 py-3">
                    <div className="flex-initial w-36 px-3 text-black/40 font-serif">
                      <div>{new Date(transaction.created_at).toLocaleDateString()}</div>
                      <div>{new Date(transaction.created_at).toLocaleTimeString()}</div>
                    </div>
                    <div className="flex justify-between w-full px-3">
                      <div>
                        <div className="italic">{transaction.type}</div>
                        <div className="text-black/40 font-serif text-xs">{transaction.id}</div>
                      </div>
                      <div>IDR {Intl.NumberFormat('en-us').format(transaction.total_payment)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {/* Menu Top-Up */}
          {action === 'topup' ? (
            <div>
              <div className="flex justify-end items-center mt-1">
                <div>
                  <h3>IDR {Intl.NumberFormat('en-us').format(cardData?.balance)}</h3>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex">
                  <div>
                    <button onClick={handleBack}>
                      <IoIosArrowBack size={30} />
                    </button>
                  </div>
                  <div className="mx-2">
                    <h4>Top-Up Card</h4>
                  </div>
                </div>
                <div className="mt-4 mx-10">
                  {cardData?.status === 'active' ? null : (
                    <div className="flex items-center">
                      <div className="flex flex-col">
                        <label htmlFor="customerName">Customer Name</label>
                        {customerNameIsEmpty ? (
                          <input type="text" className="border border-red-500 py-1 px-2 rounded-md w-40" id="customerName" placeholder="Customer Name" value={customerName} onChange={handleChangeCustomerName} />
                        ) : (
                          <input type="text" className="border border-black/40 py-1 px-2 rounded-md w-40" id="customerName" placeholder="Customer Name" value={customerName} onChange={handleChangeCustomerName} />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="customerId" className="mx-3">
                          Phone Number
                        </label>
                        {customerIdIsEmpty ? (
                          <input type="text" className="border border-red-500 py-1 px-2 rounded-md w-44 mx-3" id="customerId" placeholder="Phone Number" value={customerId} onChange={handleChangeCustomerId} />
                        ) : (
                          <input type="text" className="border border-black/40 py-1 px-2 rounded-md w-44 mx-3" id="customerId" placeholder="Phone Number" value={customerId} onChange={handleChangeCustomerId} />
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex flex-col">
                    <label htmlFor="addBalance">Amount of Top-Up</label>
                    {addBalanceIsEmpty ? (
                      <input type="number" className="border border-red-500 py-1 px-2 rounded-md w-56" id="addBalance" placeholder="Amount of Top-Up" value={addBalance} onChange={handleChangeAddBalance} />
                    ) : (
                      <input type="number" className="border border-black/40 py-1 px-2 rounded-md w-56" id="addBalance" placeholder="Amount of Top-Up" value={addBalance} onChange={handleChangeAddBalance} />
                    )}
                  </div>

                  {paymentMethodIsEmpty ? (
                    <FormControl sx={{ mt: 2, minWidth: 120 }} size="small" error>
                      <InputLabel id="demo-select-small-label">Payment</InputLabel>
                      <Select labelId="demo-select-small-label" id="demo-select-small" label="Payment" value={paymentMethod} onChange={handleChangePaymentMethod}>
                        {paymentMethodData
                          ? paymentMethodData.map((payment: any) => (
                              <MenuItem key={payment.name} value={payment.name}>
                                {payment.name}
                              </MenuItem>
                            ))
                          : null}
                        <MenuItem value="Cash">Cash</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    <FormControl sx={{ mt: 2, minWidth: 120 }} size="small">
                      <InputLabel id="demo-select-small-label">Payment</InputLabel>
                      <Select labelId="demo-select-small-label" id="demo-select-small" label="Payment" value={paymentMethod} onChange={handleChangePaymentMethod}>
                        {paymentMethodData
                          ? paymentMethodData.map((payment: any) => (
                              <MenuItem key={payment.name} value={payment.name}>
                                {payment.name}
                              </MenuItem>
                            ))
                          : null}
                      </Select>
                    </FormControl>
                  )}

                  <div className="mt-3">
                    <div>
                      <input type="text" className="border border-black/40 py-1 px-2 rounded-md w-40" placeholder="Note..." value={note} onChange={handleChangeNote} />
                    </div>
                  </div>

                  {cardData?.status === 'active' ? null : (
                    <div className="flex items-center mt-3">
                      <div>
                        <p className="text-xs text-black/60">Customers must have a minimum balance of IDR 5,000 in their card, and cannot buy anything with it</p>
                      </div>
                    </div>
                  )}
                  {cardData?.status === 'active' ? (
                    <div className="mt-5">
                      <button
                        className="py-2 px-3 bg-gray-500 text-white rounded-md hover:opacity-60 duration-300"
                        onClick={() => {
                          topUpCardBalance(cardData.id);
                        }}
                      >
                        Add Balance
                      </button>
                    </div>
                  ) : (
                    <div className="mt-5">
                      <button
                        className="py-2 px-3 bg-gray-500 text-white rounded-md hover:opacity-60 duration-300"
                        onClick={() => {
                          topUpAndActivate(cardData.id);
                        }}
                      >
                        Top-Up & Activate
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {/* Menu Checkout */}
          {action === 'checkout' ? (
            <div>
              <div className="flex justify-end items-center mt-1">
                <div>
                  <h3>IDR {Intl.NumberFormat('en-us').format(cardData?.balance)}</h3>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex">
                  <div>
                    <button onClick={handleBack}>
                      <IoIosArrowBack size={30} />
                    </button>
                  </div>
                  <div className="mx-2">
                    <h4>Checkout Card</h4>
                  </div>
                </div>
                <div className="mt-4 mx-10">
                  <div className="mt-2">
                    <p>
                      Checkout a Card will <strong>deactivate</strong> the card, and <strong>erase</strong> all customer details from the card so that the card no longer belongs to the customer. Do you agree?
                    </p>
                  </div>
                  <FormControl sx={{ mt: 2, minWidth: 120 }} size="small">
                    <InputLabel id="demo-select-small-label">Payment</InputLabel>
                    <Select labelId="demo-select-small-label" id="demo-select-small" label="Payment" value={paymentMethod} onChange={handleChangePaymentMethod}>
                      <MenuItem value="Cash">Cash</MenuItem>
                    </Select>
                  </FormControl>

                  <div className="mt-3">
                    <div>
                      <input type="text" className="border border-black/40 py-1 px-2 rounded-md w-40" placeholder="Note..." value={note} onChange={handleChangeNote} />
                    </div>
                  </div>
                  <div className="flex mt-5">
                    <button className="py-2 px-3 bg-gray-500 text-white rounded-md hover:opacity-60 duration-300" onClick={handleBack}>
                      Cancel
                    </button>
                    <button
                      className="py-2 px-3 mx-2 bg-red-600 text-white rounded-md hover:opacity-60 duration-300"
                      onClick={() => {
                        checkoutCard(cardData.id);
                      }}
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Menu Adjust */}
          {action === 'adjust' ? (
            <div>
              <div className="flex justify-end items-center mt-1">
                <div>
                  <h3>IDR {Intl.NumberFormat('en-us').format(cardData?.balance)}</h3>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex">
                  <div>
                    <button onClick={handleBack}>
                      <IoIosArrowBack size={30} />
                    </button>
                  </div>
                  <div className="mx-2">
                    <h4>Adjust Card Balance</h4>
                  </div>
                </div>
                <div className="mt-4 mx-10">
                  <div className="mt-2">
                    <p className="text-gray-500">Balance Adjustment will also be recorded as well as other actions.</p>
                  </div>
                  <div className="mt-2 flex flex-col">
                    <label htmlFor="adjustedBalance">Adjust to</label>
                    {adjustedBalanceIsEmpty ? (
                      <input type="number" className="border border-red-500 py-1 px-2 rounded-md w-56" id="adjustedBalance" placeholder="Amount of Top-Up" value={adjustedBalance} onChange={handleChangeAdjustedBalance} />
                    ) : (
                      <input type="number" className="border border-black/40 py-1 px-2 rounded-md w-56" id="adjustedBalance" placeholder="Amount of Top-Up" value={adjustedBalance} onChange={handleChangeAdjustedBalance} />
                    )}
                  </div>
                  <div className="mt-3">
                    <div>
                      <input type="text" className="border border-black/40 py-1 px-2 rounded-md w-40" placeholder="Note..." value={note} onChange={handleChangeNote} />
                    </div>
                  </div>

                  <div className="flex mt-5">
                    <button className="py-2 px-3 bg-gray-500 text-white rounded-md hover:opacity-60 duration-300" onClick={handleBack}>
                      Cancel
                    </button>
                    <button
                      className="py-2 px-3 mx-2 bg-green-600 text-white rounded-md hover:opacity-60 duration-300"
                      onClick={() => {
                        adjustCardBalance(cardData.id);
                      }}
                    >
                      Adjust
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CardAction;
