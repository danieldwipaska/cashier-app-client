import { useEffect, useState } from 'react';
import Nav from '../../components/Nav';
import SideNav from '../../components/SideNav';
import Menu from '../../components/Home/Menu';
import Cart from '../../components/Home/Cart';
import OrderSummary from '../../components/Home/OrderSummary';
import { Backdrop } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useCheckToken } from '../../hooks/useCheckToken';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { ReportStatus, ReportType, SHOP_QUERY_KEY } from 'configs/utils';
import { useDispatch, useSelector } from 'react-redux';
import { setServiceAndTax, updateOrder } from 'context/slices/orderSlice';
import { calculateDiscountedPrice } from 'functions/tax-service';
import { ServiceTax } from 'lib/taxes/taxes.calculation';
import { NestedModal } from 'components/modals/Modal';
import Invoices from 'components/PaymentHistory/Invoices';

const Home = () => {
  // Auth
  const { user } = useAuth();
  const dispatch = useDispatch();
  const orderState = useSelector((state: any) => state.order);
  // START STATES

  // Cart & Summary
  const [openSummary, setOpenSummary] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openCart, setOpenCart] = useState<boolean>(false);

  // Crew Auth
  const [crewCredential, setCrewCredential] = useState('');
  const [openCrewAuthAlertDialog, setOpenCrewAuthAlertDialog] = useState(false);
  const [errorCrewCredential, setErrorCrewCredential] = useState(false);
  const [errorUnauthorizedCrew, setErrorUnauthorizedCrew] = useState(false);
  const [isLoadingSubmitCrewCredential, setIsLoadingSubmitCrewCredential] = useState<boolean>(false);

  // Receipt
  const [openReceiptModal, setReceiptModal] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  // SideNav
  const [showSideNav, setShowSideNav] = useState<boolean>(false);

  // END STATES

  // START QUERIES
  const { data: reports, refetch: reportsRefetch } = useQuery({
    queryKey: ['unpaidReports'],
    queryFn: () =>
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/reports?status=${ReportStatus.UNPAID}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
        .then((res) => {
          const reportData = res.data.data.map((report: any) => {
            return { ...report, served_by: report.crew.name };
          });

          return reportData;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  const { data: shop } = useQuery({
    queryKey: SHOP_QUERY_KEY,
    queryFn: async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/shops/shop`, {
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
  // END QUERIES

  // START HOOKS
  useCheckToken(user);
  useEffect(() => {
    if (shop) {
      const shopPayload = {
        service: shop.service,
        tax: shop.tax,
        included_tax_service: shop.included_tax_service,
      };

      dispatch(setServiceAndTax(shopPayload));
    }

    const totalDiscountedPrice = calculateDiscountedPrice(orderState.order.items);
    const totalPaymentAfterTaxService = new ServiceTax(totalDiscountedPrice, orderState.serviceAndTax.service, orderState.serviceAndTax.tax).calculateTax();

    if (!orderState.serviceAndTax.included_tax_service) {
      dispatch(updateOrder({ total_payment: totalDiscountedPrice }));
      dispatch(updateOrder({ total_payment_after_tax_service: totalPaymentAfterTaxService }));
    } else {
      dispatch(updateOrder({ total_payment: totalDiscountedPrice }));
      dispatch(updateOrder({ total_payment_after_tax_service: totalDiscountedPrice }));
    }
  }, [dispatch, orderState.order.items, orderState.serviceAndTax.included_tax_service, orderState.serviceAndTax.service, orderState.serviceAndTax.tax, shop]);
  // END HOOKS

  // START FUNCTIONS
  const handleCloseDetailModal = () => {
    setReceiptModal(false);
    setPaymentData(null);
  };
  // END FUNCTIONS

  return (
    <div>
      <Nav setShowSideNav={setShowSideNav} />

      <div className="flex">
        <SideNav mobileOpen={showSideNav} setMobileOpen={setShowSideNav} />

        <Menu openSummary={openSummary} setOpenSummary={setOpenSummary} />

        {openSummary ? (
          <OrderSummary
            states={{
              openSummary,
              setOpenSummary,
              openBackdrop,
              setOpenBackdrop,
              openCart,
              setOpenCart,
            }}
            crewData={{
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
            }}
            unpaidReports={{
              reports,
              reportsRefetch,
            }}
            receiptData={{
              openReceiptModal,
              setReceiptModal,
              paymentData,
              setPaymentData,
            }}
          />
        ) : (
          <Cart
            states={{
              openSummary,
              setOpenSummary,
              openBackdrop,
              setOpenBackdrop,
              openCart,
              setOpenCart,
            }}
            crewData={{
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
            }}
            unpaidReports={{
              reports,
              reportsRefetch,
            }}
            receiptData={{
              openReceiptModal,
              setReceiptModal,
              paymentData,
              setPaymentData,
            }}
          />
        )}
      </div>

      <NestedModal open={openReceiptModal} handleClose={handleCloseDetailModal} divClass={`overflow-y-auto max-h-screen`}>
        <div className=" relative text-sm">
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-bold mt-5">Bahari Irish Pub</h1>
            <p>Jl. Kawi No.8A, Kota Malang</p>
            <p>Indonesia, 65119</p>
            <div className="my-3 w-full border border-b-black border-dashed"></div>
            <p>{paymentData?.report_id}</p>
            <div className="my-3 w-full border border-b-black border-dashed"></div>
          </div>
          <div className="flex justify-between">
            <p>{new Date(paymentData?.updated_at).toLocaleDateString()}</p>
            <p>{new Date(paymentData?.updated_at).toLocaleTimeString()}</p>
          </div>
          <div className="flex justify-between">
            <p>Served by</p>
            <p>{paymentData?.crew?.name}</p>
          </div>
          <div className="flex justify-between">
            <p>Customer Name</p>
            <p>{paymentData?.customer_name}</p>
          </div>
          <div className="my-3 w-full border border-b-black border-dashed"></div>
          <div>
            <div className="max-h-[calc(100vh-500px)] overflow-y-auto">
              {paymentData?.Item.map((item: any, i: number) => (
                <div key={i} className="flex justify-between">
                  <div className="flex">
                    <div>{item.fnb?.name}</div>
                    <div>...x {item.amount}</div>
                  </div>
                  <div>{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price * item.amount)}</div>
                </div>
              ))}
            </div>
            {paymentData?.type !== ReportType.PAY ? (
              <div className="flex justify-between">
                <div>{paymentData?.type}</div>
                <div>{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(paymentData?.total_payment_after_tax_service)}</div>
              </div>
            ) : null}

            <div className="my-3 w-full border border-b-black border-dashed"></div>

            {paymentData?.type !== ReportType.PAY ? null : (
              <div className=" mb-1">
                <div className="flex justify-between">
                  <div>Subtotal</div>
                  <div>{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(paymentData?.total_payment)}</div>
                </div>
                <div className="flex justify-between">
                  <div>Service {paymentData?.included_tax_service ? '- included' : ''}</div>
                  <div></div>
                </div>
                <div className="flex justify-between">
                  <div>Tax (PB1) {paymentData?.included_tax_service ? '- included' : ''}</div>
                  <div></div>
                </div>
              </div>
            )}

            <div className=" font-bold mt-3">
              <div className="flex justify-between">
                <div>
                  <div>Total</div>
                </div>
                <div>
                  <div>{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(paymentData?.total_payment_after_tax_service)}</div>
                </div>
              </div>
            </div>

            <div className="my-3 w-full border border-b-black border-dashed"></div>

            <div>
              <div>Note:</div>
              <div>{paymentData ? paymentData.note : null}</div>
            </div>
          </div>
          <div className="flex justify-end">
            <Invoices selectedPaymentData={paymentData} />
          </div>

          {paymentData?.status === ReportStatus.PAID ? (
            <div className="absolute top-4 right-0">
              <CheckCircle sx={{ fontSize: 40 }} color="success" />
            </div>
          ) : (
            <div className="absolute top-2 right-0 p-2 font-semibold text-sm text-red-500">{paymentData?.status}</div>
          )}
        </div>
      </NestedModal>

      <Backdrop sx={{ color: '#fff', bgcolor: 'rgb(59,164,112,0.7)', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openBackdrop} transitionDuration={300}>
        <CheckCircle color="inherit" fontSize="large" />
      </Backdrop>
    </div>
  );
};

export default Home;
