import { ArrowBackIosNew } from '@mui/icons-material';
import axios from 'axios';
import CrewAuthAlertDialogSlide from './CrewAuthAlertDialogSlide';
import { METHOD_QUERY_KEY, ReportStatus, ReportType } from 'configs/utils';
import ICartProps from 'interfaces/CartProps';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { clearOrder } from 'context/slices/orderSlice';

const OrderSummary = ({ states, crewData, unpaidReports, receiptData }: ICartProps) => {
  const order = useSelector((state: any) => state.order.order);
  const dispatch = useDispatch();

  const { setOpenSummary, setOpenBackdrop, setOpenCart } = states;
  const {
    crewCredential,
    setCrewCredential,
    openCrewAuthAlertDialog,
    setOpenCrewAuthAlertDialog,
    errorCrewCredential,
    setErrorCrewCredential,
    errorUnauthorizedCrew,
    setErrorUnauthorizedCrew,
    isLoadingSubmitCrewCredential,
    setIsLoadingSubmitCrewCredential,
  } = crewData;
  const { reportsRefetch } = unpaidReports;
  const { setReceiptModal, setPaymentData } = receiptData;

  const handleClickOpenCrewAuthAlertDialog = () => {
    setOpenCrewAuthAlertDialog(true);
  };

  // START QUERY
  const { data: method } = useQuery({
    queryKey: METHOD_QUERY_KEY,
    queryFn: async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/methods/${order.method_id}`, {
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

  const handlePay = async () => {
    if (!crewCredential) return setErrorCrewCredential(true);

    setIsLoadingSubmitCrewCredential(true);
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

      if (!crew.data.data.is_active) return setErrorUnauthorizedCrew(true);

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

      if (order.method_id === process.env.REACT_APP_GIFT_CARD_METHOD_ID) {
        const payload = {
          type: ReportType.PAY,
          status: ReportStatus.PAID,
          customer_name: order.customer_name,
          customer_id: order.customer_id,
          crew_id: crew.data.data.id,
          method_id: order.method_id,
          note: order.note,
          items: items,
        };

        try {
          const response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/cards/${order.card_id}/pay`, payload, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access-token')}`,
            },
          });

          setPaymentData(response.data.data);

          setCrewCredential('');
          setErrorCrewCredential(false);
          setErrorUnauthorizedCrew(false);
          setOpenCart(false);

          setOpenSummary(false);

          setOpenCrewAuthAlertDialog(false);
          setOpenBackdrop(true);

          // Clear order state
          dispatch(clearOrder());

          setTimeout(() => {
            setOpenBackdrop(false);
            setReceiptModal(true);
          }, 3000);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoadingSubmitCrewCredential(false);
        }
      } else {
        const payload = {
          type: ReportType.PAY,
          status: ReportStatus.PAID,
          customer_name: order.customer_name,
          crew_id: crew.data.data.id,
          method_id: order.method_id,
          note: order.note,
          items: items,
        };

        try {
          const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/reports`, payload, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access-token')}`,
            },
          });

          setPaymentData(response.data.data);

          setCrewCredential('');
          setErrorCrewCredential(false);
          setErrorUnauthorizedCrew(false);

          setOpenCart(false);
          setOpenSummary(false);

          setOpenCrewAuthAlertDialog(false);
          setOpenBackdrop(true);

          // Clear order state
          dispatch(clearOrder());

          setTimeout(() => {
            setOpenBackdrop(false);
            setReceiptModal(true);
          }, 3000);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoadingSubmitCrewCredential(false);
        }
      }
    } catch (error: unknown) {
      return setErrorUnauthorizedCrew(true);
    } finally {
      setIsLoadingSubmitCrewCredential(false);
    }
  };

  const handlePayUpdate = async () => {
    if (!crewCredential) return setErrorCrewCredential(true);

    setIsLoadingSubmitCrewCredential(true);

    try {
      const report = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/reports/${order.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      });
      if (!report.data.data) return;

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
        if (!crew.data.data || report.data.data.crew.name !== crew.data.data.name) return setErrorUnauthorizedCrew(true);

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
          status: ReportStatus.PAID,
          customer_name: order.customer_name,
          crew_id: crew.data.data.id,
          method_id: order.method_id,
          note: order.note,
          items: items,
        };

        try {
          const response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/reports/${order.id}`, payload, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access-token')}`,
            },
          });

          setPaymentData(response.data.data);

          setCrewCredential('');
          setErrorCrewCredential(false);
          setErrorUnauthorizedCrew(false);

          setOpenCart(false);
          setOpenSummary(false);

          setOpenCrewAuthAlertDialog(false);
          setOpenBackdrop(true);

          // Clear order state
          dispatch(clearOrder());

          setTimeout(() => {
            setOpenBackdrop(false);
            reportsRefetch();
            setReceiptModal(true);
          }, 3000);
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingSubmitCrewCredential(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingSubmitCrewCredential(false);
    }
  };

  const handleBack = () => {
    setOpenSummary(false);
  };

  return (
    <div className="h-screen w-full md:w-4/12 p-5 md:p-0 md:pt-20 mx-0 md:mx-8 fixed md:static z-50 md:z-0 bg-white">
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
            <p className="text-sm font-normal">: {order.customer_name}</p>
          </div>
          <div className="mt-1 grid grid-cols-2 w-2/3 text-gray-400">
            <p className="text-sm font-normal">Payment Method</p>
            <p className="text-sm font-normal">: {method?.name}</p>
          </div>
          <div className="mt-1 grid grid-cols-2 w-2/3 text-gray-400">
            <p className="text-sm font-normal">Note</p>
            <p className="text-sm font-normal">: {order.note}</p>
          </div>

          <div className="mt-7">
            <p className="">Menu Detail</p>
          </div>

          <div className="overflow-y-auto thin-scrollbar h-[calc(100dvh-400px)]">
            {order.items.map((item: any) => (
              <div key={item.id} className="mt-3 2xl:mt-5 border border-green-600 p-2 rounded-md">
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-xl">{item.fnb_name}</p>
                      {item.discount_percent ? <p className="text-xs text-orange-500">(-{item.discount_percent}%)</p> : null}
                    </div>
                    <p className="text-sm text-black/60 mt-2">
                      {item.modifiers
                        .filter((modifier: any) => modifier.checked)
                        .map((modifier: any) => modifier.name)
                        .join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {item.discount_percent ? (
                      <div className="flex items-center mx-1">
                        <input
                          type="text"
                          className="text-sm text-black/60 py-1 bg-transparent"
                          readOnly
                          value={`${item.amount} x ${Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price - item.price * (item.discount_percent / 100))}`}
                        />
                      </div>
                    ) : (
                      <div className="mx-1">
                        <input type="text" className="text-sm text-black/60 py-1 bg-transparent" readOnly value={`${item.amount} x ${Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)}`} />
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-black/60">Note: {item.note}</p>
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
                  <p className="mx-2">{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(order.total_payment_after_tax_service)}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <button className="text-center w-full my-6 py-2 bg-green-500 hover:opacity-70 duration-500 rounded-lg" onClick={handleClickOpenCrewAuthAlertDialog}>
              Pay
            </button>
          </div>
        </div>
        <CrewAuthAlertDialogSlide
          openCrewAuthAlertDialog={openCrewAuthAlertDialog}
          setOpenCrewAuthAlertDialog={setOpenCrewAuthAlertDialog}
          handleConfirm={order.id ? handlePayUpdate : handlePay}
          crewCredential={crewCredential}
          setCrewCredential={setCrewCredential}
          errorCrewCredential={errorCrewCredential}
          setErrorCrewCredential={setErrorCrewCredential}
          errorUnauthorizedCrew={errorUnauthorizedCrew}
          setErrorUnauthorizedCrew={setErrorUnauthorizedCrew}
          isLoadingSubmitCrewCredential={isLoadingSubmitCrewCredential}
          setIsLoadingSubmitCrewCredential={setIsLoadingSubmitCrewCredential}
        />
      </div>
    </div>
  );
};

export default OrderSummary;
