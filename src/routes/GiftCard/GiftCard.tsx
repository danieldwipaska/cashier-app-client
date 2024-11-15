import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCheckToken } from '../../hooks/useCheckToken';
import SideNav from '../../components/SideNav';
import Nav from '../../components/Nav';
import CardAction from '../../components/CardAction';

const GiftCard = () => {
  const { user } = useAuth();

  // useEffect
  useCheckToken(user);

  return (
    <div>
      <Nav />

      <div className="flex">
        <SideNav />
        <CardAction />
      </div>
    </div>
  );
};

export default GiftCard;
