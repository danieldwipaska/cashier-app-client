import { useEffect, useState } from 'react';
import Nav from '../../components/Nav';
import SideNav from '../../components/SideNav';
import Menu from '../../components/Home/Menu';
import Cart from '../../components/Home/Cart';
import OrderSummary from '../../components/Home/OrderSummary';
import { Backdrop } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import sumOrders from '../../functions/sum';
import { useAuth } from '../../context/AuthContext';
import { useCheckToken } from '../../hooks/useCheckToken';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { ReportStatus } from 'configs/utils';
import { calculateDiscountedPrice } from 'functions/tax-service';
import { ServiceTax } from 'lib/taxes/taxes.calculation';

const Home = () => {
  // Auth
  const { user } = useAuth();

  // START STATES

  // Action
  const [cardId, setCardId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [note, setNote] = useState('');
  const [openBill, setOpenBill] = useState('');

  // Orders
  const [orders, setOrders] = useState<any[]>([]);
  const [shop, setShop] = useState<any>(null);

  // Calculation
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalPaymentAfterTaxService, setTotalPaymentAfterTaxService] = useState(0);

  // Cart & Summary
  const [openSummary, setOpenSummary] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  // Crew Auth
  const [crewCredential, setCrewCredential] = useState('');
  const [openCrewAuthAlertDialog, setOpenCrewAuthAlertDialog] = useState(false);
  const [errorCrewCredential, setErrorCrewCredential] = useState(false);
  const [errorUnauthorizedCrew, setErrorUnauthorizedCrew] = useState(false);

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
          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  useQuery({
    queryKey: ['shopData'],
    queryFn: () =>
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/multiusers/configuration/${user?.username}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
        .then((res) => {
          setShop(res.data.data.shops[0].shop);

          return res.data.data.shops[0].shop;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });
  // END QUERIES

  // START HOOKS
  useCheckToken(user);
  useEffect(() => {
    // Update orders whenever something changes
    setTotalOrder(sumOrders(orders));

    const taxService = new ServiceTax(calculateDiscountedPrice(orders), shop?.service, shop?.tax);

    if (shop?.included_tax_service === false) {
      return setTotalPaymentAfterTaxService(taxService.calculateTax());
    }
    
    return setTotalPaymentAfterTaxService(totalOrder);

  }, [orders, shop?.included_tax_service, shop?.service, shop?.tax, totalOrder]);
  // END HOOKS

  return (
    <div>
      <Nav />

      <div className="flex">
        <SideNav />

        <Menu orders={orders} setOrders={setOrders} openSummary={openSummary} setOpenSummary={setOpenSummary} />

        {openSummary ? (
          <OrderSummary
            actionData={{
              cardId,
              setCardId,
              cardNumber,
              setCardNumber,
              customerName,
              customerId,
              setCustomerId,
              setCustomerName,
              paymentMethod,
              setPaymentMethod,
              note,
              setNote,
              openBill,
              setOpenBill,
            }}
            orderData={{
              orders,
              setOrders,
            }}
            states={{
              openSummary,
              setOpenSummary,
              openBackdrop,
              setOpenBackdrop,
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
            }}
            unpaidReports={{
              reports,
              reportsRefetch,
            }}
            calculationData={{
              totalOrder,
              setTotalOrder,
              totalPaymentAfterTaxService,
              setTotalPaymentAfterTaxService,
            }}
          />
        ) : (
          <Cart
            actionData={{
              cardId,
              setCardId,
              cardNumber,
              setCardNumber,
              customerName,
              customerId,
              setCustomerId,
              setCustomerName,
              paymentMethod,
              setPaymentMethod,
              note,
              setNote,
              openBill,
              setOpenBill,
            }}
            orderData={{
              orders,
              setOrders,
            }}
            states={{
              openSummary,
              setOpenSummary,
              openBackdrop,
              setOpenBackdrop,
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
            }}
            unpaidReports={{
              reports,
              reportsRefetch,
            }}
            calculationData={{
              totalOrder,
              setTotalOrder,
              totalPaymentAfterTaxService,
              setTotalPaymentAfterTaxService,
            }}
          />
        )}
      </div>
      <Backdrop sx={{ color: '#fff', bgcolor: 'rgb(59,164,112,0.7)', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openBackdrop} transitionDuration={300}>
        <CheckCircle color="inherit" fontSize="large" />
      </Backdrop>
    </div>
  );
};

export default Home;
