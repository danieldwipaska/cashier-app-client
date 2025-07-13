import { useState } from 'react';
import { ReactComponent as NewCartIcon } from '../../assets/img/icons/new-cart.svg';
import { ReactComponent as MinusIcon } from '../../assets/img/icons/minus.svg';
import { ReactComponent as PlusIcon } from '../../assets/img/icons/plus.svg';
import { ReactComponent as SaveIcon } from '../../assets/img/icons/save.svg';
import { ReactComponent as AddIcon } from '../../assets/img/icons/additional-plus.svg';
import { ReactComponent as NoteIcon } from '../../assets/img/icons/notes.svg';
import { Alert, CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import axios from 'axios';
import CrewAuthAlertDialogSlide from './CrewAuthAlertDialogSlide';
import SimpleSnackbar from '../snackbars/SimpleSnackbar';
import { ReportStatus, ReportType } from 'configs/utils';
import ICartProps from 'interfaces/CartProps';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { clearOrder, decreaseItemAmount, increaseItemAmount, Order, setOrder, updateOrder } from 'context/slices/orderSlice';
import SetModifier from './SetModifier';
import ItemNote from './ItemNote';

const Cart = ({ states, crewData, unpaidReports }: ICartProps) => {
  const order = useSelector((state: any) => state.order.order);
  const dispatch = useDispatch();

  // START STATES
  const { setOpenSummary } = states;
  const { crewCredential, setCrewCredential, openCrewAuthAlertDialog, setOpenCrewAuthAlertDialog, errorCrewCredential, setErrorCrewCredential, errorUnauthorizedCrew, setErrorUnauthorizedCrew } = crewData;
  const { reports, reportsRefetch } = unpaidReports;

  const [customerNameIsEmpty, setCustomerNameIsEmpty] = useState(false);
  const [paymentMethodIsEmpty, setPaymentMethodIsEmpty] = useState(false);
  const [cardNumberIsEmpty, setCardNumberIsEmpty] = useState(false);
  const [orderIsEmpty, setOrderIsEmpty] = useState(false);

  const [openConfirmProgressSpinner, setOpenConfirmProgressSpinner] = useState(false);
  const [openSaveProgressSpinner, setOpenSaveProgressSpinner] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [openModifierModal, setOpenModifierModal] = useState(false);
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [modifiers, setModifiers] = useState<any>(null);
  const [note, setNote] = useState('');
  const [selectedFnbId, setSelectedFnbId] = useState<any>(null);
  // END STATES

  // START QUERY
  const { data: methods } = useQuery({
    queryKey: ['cartMethods'],
    queryFn: async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/methods`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        });
        return res.data.data;
      } catch (err) {
        return console.log(err);
      }
    },
  });
  // END QUERY

  // START FUNCTIONS
  const handleClickNewOrder = () => {
    dispatch(clearOrder());
    setCrewCredential('');
    return;
  };

  const handleChangeOpenBill = async (event: any) => {
    if (!event.target.value) {
      dispatch(clearOrder());
      setCrewCredential('');
      return;
    }

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/reports/${event.target.value}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      });

      const items = res.data.data.Item.map((item: any) => {
        return {
          id: item.id,
          fnb_name: item.fnb.name,
          fnb_category: item.fnb.category,
          fnb_id: item.fnb.id,
          amount: item.amount,
          price: item.price,
          discount_percent: item.discount_percent,
          modifiers: item.ModifierItem.map((modifierItem: any) => {
            return {
              id: modifierItem.modifier.id,
              code: modifierItem.modifier.code,
              name: modifierItem.modifier.name,
              checked: true,
            }
          }),
          note: item.ModifierItem.note,
        };
      });

      const order: Order = {
        id: res.data.data.id,
        card_id: res.data.data.card_id,
        card_number: res.data.data.card_number,
        customer_name: res.data.data.customer_name,
        customer_id: res.data.data.customer_id,
        method_id: res.data.data.method_id,
        crew_id: res.data.data.crew_id,
        note: res.data.data.note,
        total_payment: res.data.data.total_payment,
        total_payment_after_tax_service: res.data.data.total_payment_after_tax_service,
        items: items,
        status: res.data.data.status,
      };

      dispatch(setOrder(order));
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickOpenCrewAuthAlertDialog = () => {
    if (!order.customer_name) return setCustomerNameIsEmpty(true);
    setOpenCrewAuthAlertDialog(true);
  };

  const handleCardNumberChange = (event: any) => {
    setCardNumberIsEmpty(false);
    dispatch(updateOrder({ card_number: event.target.value }));
  };

  const fetchModifierOption = async (fnbId: string) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/fnbs/${fnbId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      });

      const result = res.data.data.FnbModifier.map((fnbModifier: any) => {
        return {
          ...fnbModifier.modifier,
          checked: false,
        };
      });

      setModifiers([...result]);
    } catch (err) {
      return console.log(err);
    }
  };

  const increaseAmount = (id: string) => {
    dispatch(increaseItemAmount(id));
  };

  const decreaseAmount = (id: string) => {
    try {
      dispatch(decreaseItemAmount(id));
    } catch (error) {
      console.error('Error decreasing amount:', error);
    }
  };

  const handleCustomerNameChange = (event: any) => {
    setCustomerNameIsEmpty(false);
    dispatch(updateOrder({ customer_name: event.target.value }));
  };

  const handlePaymentMethodChange = (event: SelectChangeEvent) => {
    dispatch(updateOrder({ method_id: event.target.value }));
  };

  const handleNoteChange = (event: any) => {
    dispatch(updateOrder({ note: event.target.value }));
  };

  const handleSave = async () => {
    setOpenSaveProgressSpinner(true);
    if (!crewCredential) return setErrorCrewCredential(true);

    try {
      const crew = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/crews/code`,
        { code: crewCredential },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        }
      );
      if (!crew.data.data) return setErrorUnauthorizedCrew(true);

      const items = order.items.map((item: any) => {
        return {
          fnb_id: item.fnb_id,
          amount: item.amount,
          price: item.price,
          discount_percent: item.discount_percent,
          note: item.note ?? '',
          modifierItems:
            item.modifiers
              .filter((modifier: any) => modifier.checked)
              .map((modifier: any) => ({
                modifier_id: modifier.id,
              })) ?? [],
        };
      });

      const payload = {
        type: ReportType.PAY,
        status: ReportStatus.UNPAID,
        customer_name: order.customer_name,
        customer_id: order.customer_id,
        crew_id: crew.data.data.id,
        method_id: order.method_id,
        note: order.note,
        items,
      };

      try {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/reports`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        });

        setErrorCrewCredential(false);
        setErrorUnauthorizedCrew(false);
        setCrewCredential('');

        setOpenCrewAuthAlertDialog(false);
        setOpenSaveProgressSpinner(false);
        reportsRefetch();
        dispatch(clearOrder());
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirm = async () => {
    if (order.items.length === 0) {
      setOrderIsEmpty(true);
      setTimeout(() => {
        setOrderIsEmpty(false);
      }, 3000);
    } else if (!order.customer_name && order.method_id !== process.env.REACT_APP_GIFT_CARD_METHOD_ID) {
      setCustomerNameIsEmpty(true);
    } else if (!order.card_number && order.method_id === process.env.REACT_APP_GIFT_CARD_METHOD_ID) {
      setCardNumberIsEmpty(true);
    } else if (!order.method_id) {
      setPaymentMethodIsEmpty(true);
    } else {
      if (order.method_id === process.env.REACT_APP_GIFT_CARD_METHOD_ID) {
        setOpenConfirmProgressSpinner(true);
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/cards/${order.card_number}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access-token')}`,
            },
          });
          if (response.data.data.balance < order.total_payment_after_tax_service) throw new Error('Balance Not Enough');

          // setCardNumber(response.data.data.card_number);
          dispatch(
            updateOrder({
              card_id: response.data.data.id,
              card_number: response.data.data.card_number,
              customer_name: response.data.data.customer_name,
              customer_id: response.data.data.customer_id,
            })
          );
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
    <div className="h-screen w-5/12 pt-20 mx-8">
      <div className="grid grid-cols-1 content-between h-full">
        <div className="h-full">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold ">Your Order</p>
            </div>
            <div className="flex items-center">
              <div className="flex place-content-center">
                <button onClick={handleClickNewOrder} className=" hover:opacity-30 duration-300">
                  <NewCartIcon className="w-[30px]" />
                </button>
              </div>
              <FormControl sx={{ ml: 2, minWidth: 120 }} size="small">
                <Select value={order.status === ReportStatus.UNPAID && order.id ? order.id : ''} onChange={handleChangeOpenBill} displayEmpty inputProps={{ 'aria-label': 'Without label' }}>
                  <MenuItem value="">New</MenuItem>
                  {reports?.map((report: any) => (
                    <MenuItem key={report.id} value={report.id}>
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

          <div className="flex flex-col overflow-y-auto thin-scrollbar mt-2 pr-2 h-[calc(100vh-400px)]">
            {order.items?.map((item: any) => (
              <div className="mt-5 border-b-2 pb-2" key={item.fnb_id}>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 mr-2">
                    <button
                      className="flex gap-2 items-center text-left"
                      onClick={() => {
                        console.log(item);
                        setSelectedFnbId(item.fnb_id);
                        fetchModifierOption(item.fnb_id);
                        setOpenModifierModal(true);
                      }}
                    >
                      <p className="text-xl font-bold">{item.fnb_name}</p>
                      <div className={`border border-green-600 rounded-full w-8 h-8 flex items-center justify-center ${item.modifiers && item.modifiers.some((modifier: any) => modifier.checked) ? 'bg-green-600' : null}`}>
                        <AddIcon className={`w-[28px] ${item.modifiers && item.modifiers.some((modifier: any) => modifier.checked) ? 'fill-gray-700' : 'fill-green-600'}`} />
                      </div>
                      <p className=''>
                        {item.modifiers
                          .filter((modifier: any) => modifier.checked)
                          .map((modifier: any) => modifier.name)
                          .join(', ')}
                      </p>
                    </button>
                  </div>
                  <div className="flex items-center">
                    <button
                      className=" bg-green-500 hover:opacity-70 duration-500 p-2 rounded-md"
                      onClick={() => {
                        decreaseAmount(item.fnb_id);
                      }}
                    >
                      <MinusIcon className="w-[9px]" />
                    </button>
                    <div className="mx-1">
                      <input type="text" className="text-xs text-center text-black/60 py-1 px-2 rounded-md border border-black/25 max-w-8" readOnly value={item.amount} />
                    </div>
                    <button
                      className=" bg-green-500 hover:opacity-70 duration-500 p-2 rounded-md"
                      onClick={() => {
                        increaseAmount(item.fnb_id);
                      }}
                    >
                      <PlusIcon className="w-[9px]" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between mt-2">
                  <div className='flex gap-2 items-center'>
                    <button className="border border-green-600 rounded-lg w-8 h-8 flex items-center justify-center" onClick={() => {
                        setSelectedFnbId(item.fnb_id);
                        setOpenNoteModal(true);
                      }}>
                      <NoteIcon className="w-[20px] stroke-green-600" />
                    </button>
                    <p className='whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px] xl:max-w-[200px]'>{item.note}</p>
                  </div>
                  {item.discount_percent ? (
                    <div className="flex items-center">
                      <p className="text-sm text-orange-500 mr-1">(-{item.discount_percent}%)</p>
                      <p className="text-sm">{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price * item.amount - (item.price * item.amount * item.discount_percent) / 100)}</p>
                    </div>
                  ) : (
                    <div className="">
                      <p className="text-sm">{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price * item.amount)}</p>
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
                <InputLabel id="demo-select-small-label" error={paymentMethodIsEmpty}>
                  Payment
                </InputLabel>

                <Select labelId="demo-select-small-label" id="demo-select-small" label="Payment" value={order.method_id} onChange={handlePaymentMethodChange} error={paymentMethodIsEmpty}>
                  {methods?.map((method: any) => {
                    return (
                      <MenuItem key={method.id} value={method.id}>
                        {method.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              {order.method_id === process.env.REACT_APP_GIFT_CARD_METHOD_ID ? (
                <FormControl size="small" sx={{ m: 0, minWidth: 120 }}>
                  {cardNumberIsEmpty ? (
                    <TextField id="card-number" error label="Card" variant="outlined" size="small" onChange={handleCardNumberChange} value={order.card_number} />
                  ) : (
                    <TextField id="card-number" label="Card" variant="outlined" size="small" onChange={handleCardNumberChange} value={order.card_number} />
                  )}
                </FormControl>
              ) : (
                <FormControl size="small" sx={{ m: 0, minWidth: 120 }}>
                  {customerNameIsEmpty ? (
                    <TextField id="customer-name" error label="Customer Name" variant="outlined" size="small" onChange={handleCustomerNameChange} value={order.customer_name} />
                  ) : (
                    <TextField id="customer-name" label="Customer Name" variant="outlined" size="small" onChange={handleCustomerNameChange} value={order.customer_name} />
                  )}
                </FormControl>
              )}

              <FormControl size="small" sx={{ mt: 0, minWidth: 120 }}>
                <TextField id="note" label="Note" variant="outlined" size="small" onChange={handleNoteChange} value={order.note} />
              </FormControl>
            </div>
            <div className="flex justify-between">
              <div>
                <p>Total</p>
              </div>
              <div>
                <div className="flex text-black/60">
                  <p className="mx-2">{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(order.total_payment_after_tax_service)}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex py-2">
            <button
              className={`text-center my-2 mr-2 py-1 px-3 border border-black/60 duration-500 rounded-lg ${
                order.method_id === process.env.REACT_APP_GIFT_CARD_METHOD_ID || !order.method_id || order.status === ReportStatus.UNPAID ? 'opacity-30' : 'hover:border-green-500 hover:bg-green-500'
              }`}
              onClick={handleClickOpenCrewAuthAlertDialog}
              disabled={order.method_id === process.env.REACT_APP_GIFT_CARD_METHOD_ID || !order.method_id || order.status === ReportStatus.UNPAID ? true : false}
            >
              {openSaveProgressSpinner ? <CircularProgress color="secondary" size={15} /> : <SaveIcon className="w-[25px]" />}
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
      <SetModifier open={openModifierModal} setOpen={setOpenModifierModal} modifiers={modifiers} setModifiers={setModifiers} fnbId={selectedFnbId} />
      <ItemNote open={openNoteModal} setOpen={setOpenNoteModal} note={note} setNote={setNote} fnbId={selectedFnbId} />
      <SimpleSnackbar open={openSnackbar} setOpen={setOpenSnackbar} message={snackbarMessage} />
    </div>
  );
};

export default Cart;
