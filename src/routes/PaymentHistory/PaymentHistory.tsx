import React from 'react';
import Nav from '../../components/Nav';
import SideNav from '../../components/SideNav';
import ListOfPayment from '../../components/ListOfPayment';

const PaymentHistory = () => {
  return (
    <div>
      <Nav />

      <div className="flex">
        <SideNav />
        <ListOfPayment />
        <div className="h-screen pt-24 mx-8"></div>
      </div>
    </div>
  );
};

export default PaymentHistory;
