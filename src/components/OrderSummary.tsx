import { ArrowBackIosNew } from '@mui/icons-material';
import axios from 'axios';

import { IoFastFoodOutline } from 'react-icons/io5';

const OrderSummary = (props: any) => {
  const { orders, setOrders, customerName, setCustomerName, paymentMethod, setPaymentMethod, note, setNote, setOpenSummary, openBackdrop, setOpenBackdrop, totalOrder, setTotalOrder } = props;

  const handlePay = async () => {
    try {
      await axios.post('http://localhost:3001/reports', {
        customerName,
        collectedBy: 'Mike',
        totalPayment: totalOrder,
        paymentMethod,
        orders,
        note,
      });

      setOpenSummary(false);
      setOrders([]);
      setCustomerName('');
      setPaymentMethod('');
      setNote('');
      setOpenBackdrop(true);

      setTimeout(() => {
        setOpenBackdrop(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    setOpenSummary(false);
  };

  return (
    <div className="h-screen w-3/12 pt-20 mx-8">
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
                    <div className="mx-1">
                      <input type="text" className="text-xs text-black/60 py-1" readOnly value={`${order.amount} x ${order.price}`} />
                    </div>
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
                  <p>IDR</p>
                  <p className="mx-2">{Intl.NumberFormat('en-us').format(totalOrder)}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <button className="text-center w-full my-6 py-2 bg-green-500 hover:opacity-70 duration-500 rounded-lg" onClick={handlePay}>
              Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
