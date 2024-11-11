import React from 'react';
import Nav from '../../components/Nav';
import SideNav from '../../components/SideNav';
import ListOfPayment from '../../components/ListOfPayment';
import { useAuth } from '../../context/AuthContext';
import { useCheckToken } from '../../hooks/useCheckToken';

const PaymentHistory = () => {
  const { user } = useAuth();

  // useEffect
  useCheckToken(user);

  return (
    <div>
      <Nav />

      <div className="flex">
        <SideNav />
        <ListOfPayment />
      </div>
    </div>
  );
};

export default PaymentHistory;
