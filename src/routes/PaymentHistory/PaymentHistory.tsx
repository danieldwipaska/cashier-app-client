import React, { useState } from 'react';
import Nav from '../../components/Nav';
import SideNav from '../../components/SideNav';
import ListOfPayment from '../../components/PaymentHistory/ListOfPayment';
import { useAuth } from '../../context/AuthContext';
import { useCheckToken } from '../../hooks/useCheckToken';

const PaymentHistory = () => {
  const { user } = useAuth();
  const [showSideNav, setShowSideNav] = useState<boolean>(false);

  // useEffect
  useCheckToken(user);

  return (
    <div>
      <Nav setShowSideNav={setShowSideNav} />

      <div className="flex">
        <SideNav mobileOpen={showSideNav} setMobileOpen={setShowSideNav} />
        <ListOfPayment />
      </div>
    </div>
  );
};

export default PaymentHistory;
