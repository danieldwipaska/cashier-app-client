import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCheckToken } from '../../hooks/useCheckToken';
import SideNav from '../../components/SideNav';
import Nav from '../../components/Nav';
import CardDetails from 'components/GiftCard/CardDetails';
import SearchCard from 'components/GiftCard/SearchCard';
import { API_BASE_URL, CUSTOMER_REPORTS_QUERY_KEY } from 'configs/utils';
import axios from 'axios';
import { Card } from 'lib/interfaces/cards';
import { useQuery } from '@tanstack/react-query';

const GiftCard = () => {
  const { user } = useAuth();
  const [cardData, setCardData] = useState<any>(null);

  // useEffect
  useCheckToken(user);

  // START QUERIES
  const { data: customerReports, refetch: customerReportsRefetch } = useQuery({
    queryKey: CUSTOMER_REPORTS_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${API_BASE_URL}/reports/transactions/${cardData.cardNumber}?&customer_id=${cardData.customerId}`)
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          if (err.status === 404) return [];
          return console.log(err);
        }),
  });
  // END QUERIES

  const refetchCardData = async (cardNumber: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cards/${cardNumber}`);

      const cardData: Card = {
        id: response.data.data.id,
        cardNumber: response.data.data.card_number,
        customerName: response.data.data.customer_name,
        customerId: response.data.data.customer_id,
        balance: response.data.data.balance,
        status: response.data.data.status,
        updatedAt: response.data.data.updated_at,
      };

      setCardData(cardData);
      return;
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (cardData) {
      customerReportsRefetch();
    }
  }, [cardData, customerReportsRefetch]);

  return (
    <div>
      <Nav />

      <div className="flex">
        <SideNav />
        <div className={`bg-gray-200 max-h-screen pt-20 pb-8 px-8 w-full ${cardData ? null : 'grid grid-cols-1 place-items-center'}`}>
          {cardData ? <CardDetails cardData={cardData} setCardData={setCardData} refetchCardData={refetchCardData} customerReports={customerReports}  /> : <SearchCard setCardData={setCardData} />}
        </div>
      </div>
    </div>
  );
};

export default GiftCard;
