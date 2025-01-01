import React, { useEffect, useState } from 'react';
import Nav from '../../components/Nav';
import SideNav from '../../components/SideNav';
import Menu from '../../components/Menu';
import Cart from '../../components/Cart';
import OrderSummary from '../../components/OrderSummary';
import { Backdrop } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import sumOrders from '../../functions/sum';
import { useAuth } from '../../context/AuthContext';
import { useCheckToken } from '../../hooks/useCheckToken';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const Home = () => {
  const [cardId, setCardId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [orders, setOrders] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [note, setNote] = useState('');
  const [totalOrder, setTotalOrder] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);
  const [servicePercent, setServicePercent] = useState(0);
  const [totalTaxService, setTotalTaxService] = useState(0);
  const [taxServiceIncluded, setTaxServiceIncluded] = useState(false);

  const [openSummary, setOpenSummary] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const [crewCredential, setCrewCredential] = useState('');
  const [openCrewAuthAlertDialog, setOpenCrewAuthAlertDialog] = useState(false);
  const [errorCrewCredential, setErrorCrewCredential] = useState(false);
  const [errorUnauthorizedCrew, setErrorUnauthorizedCrew] = useState(false);

  const [openBill, setOpenBill] = useState('');

  const { user } = useAuth();

  // useEffect
  useCheckToken(user);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/multiusers/configuration/${user?.username}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      })
      .then((res) => {
        setTotalOrder(sumOrders(orders));
        setTaxPercent(res.data.data.shop.included_tax_service ? 0 : res.data.data.shop.tax);
        setServicePercent(res.data.data.shop.included_tax_service ? 0 : res.data.data.shop.service);
        setTaxServiceIncluded(res.data.data.shop.included_tax_service);
        setTotalTaxService(
          res.data.data.shop.included_tax_service ? 0 : (sumOrders(orders) + (sumOrders(orders) * res.data.data.shop.service / 100)) * res.data.data.shop.tax / 100
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, [orders]);

  const { data: reports, refetch: reportsRefetch } = useQuery({
    queryKey: ['unpaidReports'],
    queryFn: () =>
      axios
        .get(`http://localhost:3001/reports?status=unpaid`)
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  return (
    <div>
      <Nav />

      <div className="flex">
        <SideNav />

        <Menu orders={orders} setOrders={setOrders} openSummary={openSummary} setOpenSummary={setOpenSummary} />

        {openSummary ? (
          <OrderSummary
            cardId={cardId}
            setCardId={setCardId}
            cardNumber={cardNumber}
            setCardNumber={setCardNumber}
            orders={orders}
            setOrders={setOrders}
            customerName={customerName}
            customerId={customerId}
            setCustomerId={setCustomerId}
            setCustomerName={setCustomerName}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            note={note}
            setNote={setNote}
            openSummary={openSummary}
            setOpenSummary={setOpenSummary}
            openBackdrop={openBackdrop}
            setOpenBackdrop={setOpenBackdrop}
            totalOrder={totalOrder}
            setTotalOrder={setTotalOrder}
            crewCredential={crewCredential}
            setCrewCredential={setCrewCredential}
            openCrewAuthAlertDialog={openCrewAuthAlertDialog}
            setOpenCrewAuthAlertDialog={setOpenCrewAuthAlertDialog}
            errorCrewCredential={errorCrewCredential}
            setErrorCrewCredential={setErrorCrewCredential}
            errorUnauthorizedCrew={errorUnauthorizedCrew}
            setErrorUnauthorizedCrew={setErrorUnauthorizedCrew}
            openBill={openBill}
            setOpenBill={setOpenBill}
            reports={reports}
            reportsRefetch={reportsRefetch}
            taxPercent={taxPercent}
            setTaxPercent={setTaxPercent}
            servicePercent={servicePercent}
            setServicePercent={setServicePercent}
            totalTaxService={totalTaxService}
            setTotalTaxService={setTotalTaxService}
            taxServiceIncluded={taxServiceIncluded}
            setTaxServiceIncluded={setTaxServiceIncluded}
          />
        ) : (
          <Cart
            cardId={cardId}
            setCardId={setCardId}
            cardNumber={cardNumber}
            setCardNumber={setCardNumber}
            orders={orders}
            setOrders={setOrders}
            customerName={customerName}
            customerId={customerId}
            setCustomerId={setCustomerId}
            setCustomerName={setCustomerName}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            note={note}
            setNote={setNote}
            openSummary={openSummary}
            setOpenSummary={setOpenSummary}
            totalOrder={totalOrder}
            setTotalOrder={setTotalOrder}
            crewCredential={crewCredential}
            setCrewCredential={setCrewCredential}
            openCrewAuthAlertDialog={openCrewAuthAlertDialog}
            setOpenCrewAuthAlertDialog={setOpenCrewAuthAlertDialog}
            errorCrewCredential={errorCrewCredential}
            setErrorCrewCredential={setErrorCrewCredential}
            errorUnauthorizedCrew={errorUnauthorizedCrew}
            setErrorUnauthorizedCrew={setErrorUnauthorizedCrew}
            openBill={openBill}
            setOpenBill={setOpenBill}
            reports={reports}
            reportsRefetch={reportsRefetch}
            taxPercent={taxPercent}
            setTaxPercent={setTaxPercent}
            servicePercent={servicePercent}
            setServicePercent={setServicePercent}
            totalTaxService={totalTaxService}
            setTotalTaxService={setTotalTaxService}
            taxServiceIncluded={taxServiceIncluded}
            setTaxServiceIncluded={setTaxServiceIncluded}
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
