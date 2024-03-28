import React, { useEffect, useState } from 'react';
import Nav from '../../components/Nav';
import SideNav from '../../components/SideNav';
import Menu from '../../components/Menu';
import Cart from '../../components/Cart';
import OrderSummary from '../../components/OrderSummary';
import { Backdrop } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import sum from '../../functions/sum';
import { useAuth } from '../../context/AuthContext';
import { useCheckToken } from '../../hooks/useCheckToken';

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [note, setNote] = useState('');
  const [totalOrder, setTotalOrder] = useState(0);

  const [openSummary, setOpenSummary] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const { user } = useAuth();

  // useEffect
  useCheckToken(user);

  useEffect(() => {
    setTotalOrder(sum(orders));
  }, [orders]);

  return (
    <div>
      <Nav />

      <div className="flex">
        <SideNav />

        <Menu orders={orders} setOrders={setOrders} openSummary={openSummary} setOpenSummary={setOpenSummary} />

        {openSummary ? (
          <OrderSummary
            orders={orders}
            setOrders={setOrders}
            customerName={customerName}
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
          />
        ) : (
          <Cart
            orders={orders}
            setOrders={setOrders}
            customerName={customerName}
            setCustomerName={setCustomerName}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            note={note}
            setNote={setNote}
            openSummary={openSummary}
            setOpenSummary={setOpenSummary}
            totalOrder={totalOrder}
            setTotalOrder={setTotalOrder}
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
