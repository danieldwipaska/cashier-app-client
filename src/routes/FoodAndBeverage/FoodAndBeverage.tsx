import React from 'react';
import Nav from '../../components/Nav';
import SideNav from '../../components/SideNav';
import MenuManagement from '../../components/MenuManagement';

const FoodAndBeverage = () => {
  return (
    <div>
      <Nav />

      <div className="flex">
        <SideNav />
        <MenuManagement />
        <div className="h-screen pt-24 mx-8"></div>
      </div>
    </div>
  );
};

export default FoodAndBeverage;
