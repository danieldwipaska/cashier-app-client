import { ArrowBackIosNew } from '@mui/icons-material';
import axios, { AxiosError } from 'axios';
import { ReactComponent as FoodIcon } from "../../assets/img/icons/food.svg";
import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import CrewAuthAlertDialogSlide from './CrewAuthAlertDialogSlide';
import { PaymentMethod, ReportStatus, ReportType } from 'configs/utils';
import ICartProps from 'interfaces/CartProps';

const OrderSummary = ({ actionData, orderData, states, crewData, unpaidReports, calculationData }: ICartProps) => {
  const { cardId, setCardId, setCardNumber, customerName, customerId, setCustomerId, setCustomerName, paymentMethod, setPaymentMethod, note, setNote, openBill, setOpenBill } = actionData;
  const { orders, setOrders } = orderData;
  const { setOpenSummary, setOpenBackdrop } = states;
  const { crewCredential, setCrewCredential, openCrewAuthAlertDialog, setOpenCrewAuthAlertDialog, errorCrewCredential, setErrorCrewCredential, errorUnauthorizedCrew, setErrorUnauthorizedCrew } = crewData;
  const { reportsRefetch } = unpaidReports;
  const { totalPaymentAfterTaxService } = calculationData;

  const [openConfirmProgressSpinner, setOpenConfirmProgressSpinner] = useState(false);

  const handleClickOpenCrewAuthAlertDialog = () => {
    setOpenCrewAuthAlertDialog(true);
  };

  const handlePay = async () => {
    if (!crewCredential) return setErrorCrewCredential(true);

    try {
      const crew = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/crews/code`, { code: crewCredential }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      });

      const order_id: string[] = [];
      const order_name: string[] = [];
      const order_category: string[] = [];
      const order_amount: number[] = [];
      const order_price: number[] = [];
      const order_discount_status: boolean[] = [];
      const order_discount_percent: number[] = [];

      setOpenConfirmProgressSpinner(true);

      orders.forEach((order: any) => {
        order_id.push(order.id);
        order_name.push(order.name);
        order_category.push(order.category.name);
        order_amount.push(order.amount);
        order_price.push(order.price);
        order_discount_status.push(order.discount_status);
        order_discount_percent.push(order.discount_percent);
      });

      if (paymentMethod === PaymentMethod.GIFT_CARD) {
        const payload = {
          type: ReportType.PAY,
          customer_name: customerName,
          customer_id: customerId,
          payment_method: paymentMethod,
          order_id,
          order_amount,
          note: note || null,
          crew_id: crew.data.data.id,
        };

        try {
          await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/cards/${cardId}/pay`, payload, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access-token')}`,
            },
          });

          setCardId('');
          setCardNumber('');
          setOrders([]);
          setCustomerName('');
          setCustomerId('');
          setPaymentMethod('');
          setNote('');
          setCrewCredential('');
          setErrorCrewCredential(false);
          setErrorUnauthorizedCrew(false);

          setOpenSummary(false);

          setOpenCrewAuthAlertDialog(false);
          setOpenConfirmProgressSpinner(false);
          setOpenBackdrop(true);

          setTimeout(() => {
            setOpenBackdrop(false);
          }, 3000);
        } catch (error) {
          console.log(error);
        }
      } else {
        const payload = {
          type: ReportType.PAY,
          customer_name: customerName,
          payment_method: paymentMethod,
          order_id,
          order_amount,
          note: note || null,
          crew_id: crew.data.data.id,
        };

        try {
          await axios.post(`${process.env.REACT_APP_API_BASE_URL}/reports`, payload, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access-token')}`,
            },
          });

          setOrders([]);
          setCustomerName('');
          setCustomerId('');
          setPaymentMethod('');
          setNote('');
          setCrewCredential('');
          setErrorCrewCredential(false);
          setErrorUnauthorizedCrew(false);

          setOpenSummary(false);

          setOpenCrewAuthAlertDialog(false);
          setOpenConfirmProgressSpinner(false);
          setOpenBackdrop(true);

          setTimeout(() => {
            setOpenBackdrop(false);
          }, 3000);
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError && error?.response?.data?.statusCode === 404) return setErrorUnauthorizedCrew(true);

      console.log(error);
    }
  };

  const handlePayUpdate = async () => {
    if (!crewCredential) return setErrorCrewCredential(true);

    try {
      const report = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/reports/${openBill}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      });
      if (!report.data.data) return;

      try {
        const crew = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/crews/code`, { code: crewCredential }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        });
        if (!crew.data.data || report.data.data.served_by !== crew.data.data.name) return setErrorUnauthorizedCrew(true);

        const order_id: string[] = [];
        const order_name: string[] = [];
        const order_category: string[] = [];
        const order_amount: number[] = [];
        const order_price: number[] = [];
        const order_discount_status: boolean[] = [];
        const order_discount_percent: number[] = [];

        setOpenConfirmProgressSpinner(true);

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
          status: ReportStatus.PAID,
          customer_name: customerName,
          crew_id: crew.data.data.id,
          payment_method: paymentMethod,
          order_id,
          order_amount,
          note: note || null,
        }

        try {
          await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/reports/${openBill}`, payload, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access-token')}`,
            },
          });

          setCardId('');
          setCardNumber('');
          setOrders([]);
          setCustomerName('');
          setCustomerId('');
          setPaymentMethod('');
          setNote('');
          setCrewCredential('');
          setErrorCrewCredential(false);
          setErrorUnauthorizedCrew(false);

          setOpenBill('');

          setOpenSummary(false);

          setOpenCrewAuthAlertDialog(false);

          setOpenConfirmProgressSpinner(false);
          setOpenBackdrop(true);

          setTimeout(() => {
            setOpenBackdrop(false);
            reportsRefetch();
          }, 3000);
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    setOpenSummary(false);
  };

  return (
    <div className="h-screen w-4/12 pt-20 mx-8">
      <div className="grid grid-cols-1 content-between h-full">
        <div>
          <div>
            <button onClick={handleBack}>
              <ArrowBackIosNew />
            </button>
          </div>
          <div className="mt-2">
            <p className="text-lg font-semibold">Order Detail</p>
          </div>
          <div className="mt-2 grid grid-cols-2 w-2/3 text-gray-400">
            <p className="text-sm font-normal">Customer Name</p>
            <p className="text-sm font-normal">: {customerName}</p>
          </div>
          <div className="mt-1 grid grid-cols-2 w-2/3 text-gray-400">
            <p className="text-sm font-normal">Payment Method</p>
            <p className="text-sm font-normal">: {paymentMethod}</p>
          </div>
          <div className="mt-1 grid grid-cols-2 w-2/3 text-gray-400">
            <p className="text-sm font-normal">Note</p>
            <p className="text-sm font-normal">: {note}</p>
          </div>

          <div className="mt-7">
            <p className="">Menu Detail</p>
          </div>

          <div className="overflow-y-auto h-60 2xl:h-96">
            {orders?.map((order: any) => (
              <div key={order.id} className="flex items-center mt-2 2xl:mt-5">
                <div>
                  <div className="bg-slate-800 p-2 rounded-lg">
                    <FoodIcon className='w-[40px] text-white' />
                  </div>
                </div>
                <div className="mx-3">
                  <div>
                    <p className="text-sm">{order.name}</p>
                  </div>
                  <div className="flex items-center mt-2">
                    {order.discount_status ? (
                      <div className="flex items-center mx-1">
                        <div>
                          <input
                            type="text"
                            className="text-xs text-black/60 py-1 w-28"
                            readOnly
                            value={`${order.amount} x ${Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(order.price - order.price * (order.discount_percent / 100))}`}
                          />
                        </div>
                        <div>
                          <p className="text-xs text-orange-500">(-{order.discount_percent}%)</p>
                        </div>
                      </div>
                    ) : (
                      <div className="mx-1">
                        <input type="text" className="text-xs text-black/60 py-1" readOnly value={`${order.amount} x ${Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(order.price)}`} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div>
            <div className="flex justify-between">
              <div>
                <p>Total</p>
              </div>
              <div>
                <div className="flex text-black/60">
                  <p className="mx-2">{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalPaymentAfterTaxService)}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <button className="text-center w-full my-6 py-2 bg-green-500 hover:opacity-70 duration-500 rounded-lg" onClick={handleClickOpenCrewAuthAlertDialog}>
              {openConfirmProgressSpinner ? <CircularProgress color="secondary" size={15} /> : 'Pay'}
            </button>
          </div>
        </div>
        <CrewAuthAlertDialogSlide
          openCrewAuthAlertDialog={openCrewAuthAlertDialog}
          setOpenCrewAuthAlertDialog={setOpenCrewAuthAlertDialog}
          handleConfirm={openBill ? handlePayUpdate : handlePay}
          crewCredential={crewCredential}
          setCrewCredential={setCrewCredential}
          errorCrewCredential={errorCrewCredential}
          setErrorCrewCredential={setErrorCrewCredential}
          errorUnauthorizedCrew={errorUnauthorizedCrew}
          setErrorUnauthorizedCrew={setErrorUnauthorizedCrew}
        />
      </div>
    </div>
  );
};

export default OrderSummary;
