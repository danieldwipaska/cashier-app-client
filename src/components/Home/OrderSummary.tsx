import { ArrowBackIosNew } from '@mui/icons-material';
import axios, { AxiosError } from 'axios';

import { IoFastFoodOutline } from 'react-icons/io5';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import CrewAuthAlertDialogSlide from './CrewAuthAlertDialogSlide';
import { ReportType } from 'configs/utils';
import ICartProps from 'interfaces/CartProps';

const OrderSummary = ({ actionData, orderData, states, crewData, unpaidReports, shopData, calculationData }: ICartProps) => {
  const { cardId, setCardId, cardNumber, setCardNumber, customerName, customerId, setCustomerId, setCustomerName, paymentMethod, setPaymentMethod, note, setNote, openBill, setOpenBill } = actionData;
  const { orders, setOrders } = orderData;
  const { setOpenSummary, setOpenBackdrop } = states;
  const { crewCredential, setCrewCredential, openCrewAuthAlertDialog, setOpenCrewAuthAlertDialog, errorCrewCredential, setErrorCrewCredential, errorUnauthorizedCrew, setErrorUnauthorizedCrew } = crewData;
  const { reportsRefetch } = unpaidReports;
  const { taxPercent, servicePercent, taxServiceIncluded } = shopData;
  const { totalOrder, totalTaxService } = calculationData;

  const { user } = useAuth();

  const [openConfirmProgressSpinner, setOpenConfirmProgressSpinner] = useState(false);

  const handleClickOpenCrewAuthAlertDialog = () => {
    setOpenCrewAuthAlertDialog(true);
  };

  const handlePay = async () => {
    if (!crewCredential) return setErrorCrewCredential(true);

    try {
      const crew = await axios.post(`http://localhost:3001/crews/code`, { code: crewCredential });

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

      if (paymentMethod === 'Gift Card') {
        try {
          await axios.patch(`http://localhost:3001/cards/${cardId}/pay`, {
            customer_name: customerName,
            customer_id: customerId,
            card_number: cardNumber,
            collected_by: user.username,
            crew_id: crew.data.data.id,
            total_payment: totalOrder,
            tax_percent: taxPercent,
            service_percent: servicePercent,
            total_tax_service: totalTaxService,
            total_payment_after_tax_service: totalOrder + totalTaxService,
            tax_service_included: taxServiceIncluded,
            payment_method: paymentMethod,
            order_id,
            order_name,
            order_category,
            order_amount,
            refunded_order_amount: new Array(order_id.length).fill(0),
            order_price,
            order_discount_status,
            order_discount_percent,
            note,
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
        try {
          await axios.post('http://localhost:3001/reports', {
            type: ReportType.PAY,
            customer_name: customerName,
            served_by: 'Greeter',
            crew_id: crew.data.data.id,
            collected_by: user.username,
            total_payment: totalOrder,
            tax_percent: taxPercent,
            service_percent: servicePercent,
            total_tax_service: totalTaxService,
            total_payment_after_tax_service: totalOrder + totalTaxService,
            tax_service_included: taxServiceIncluded,
            payment_method: paymentMethod,
            order_id,
            order_name,
            order_category,
            order_amount,
            refunded_order_amount: new Array(order_id.length).fill(0),
            order_price,
            order_discount_status,
            order_discount_percent,
            note,
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
      const report = await axios.get(`http://localhost:3001/reports/${openBill}`);
      if (!report.data.data) return;

      try {
        const crew = await axios.post(`http://localhost:3001/crews/code`, { code: crewCredential });
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

        try {
          await axios.patch(`http://localhost:3001/reports/${openBill}`, {
            status: 'PAID',
            customer_name: customerName,
            served_by: crew.data.data.name,
            crew_id: crew.data.data.id,
            collected_by: user.username,
            total_payment: totalOrder,
            tax_percent: taxPercent,
            service_percent: servicePercent,
            total_tax_service: totalTaxService,
            total_payment_after_tax_service: totalOrder + totalTaxService,
            tax_service_included: taxServiceIncluded,
            payment_method: paymentMethod,
            order_id,
            order_name,
            order_category,
            order_amount,
            refunded_order_amount: new Array(order_id.length).fill(0),
            order_price,
            order_discount_status,
            order_discount_percent,
            note,
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
              <div className="flex items-center mt-2 2xl:mt-5">
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
                  <p className="mx-2">{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalOrder + totalTaxService)}</p>
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
