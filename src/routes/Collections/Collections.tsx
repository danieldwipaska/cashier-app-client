import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCheckToken } from '../../hooks/useCheckToken';
import SideNav from '../../components/SideNav';
import Nav from '../../components/Nav';
import CardManagement from '../../components/CardManagement';

const Collections = () => {
  const { user } = useAuth();

  // useEffect
  useCheckToken(user);

  return (
    <div>
      <Nav />

      <div className="flex">
        <SideNav />
        <CardManagement />
        <div className="h-screen pt-24 mx-8"></div>
      </div>
    </div>
  );
};

export default Collections;
