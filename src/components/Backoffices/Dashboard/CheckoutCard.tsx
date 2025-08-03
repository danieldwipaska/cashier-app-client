import { useState } from 'react';
import { ReactComponent as CheckoutIcon } from '../../../assets/img/icons/checkout.svg';
import Card from './Card';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getOperationalHours, getTotalPayment } from 'functions/operational.report';
import { ReportStatus, ReportType } from 'configs/utils';
import { CircularProgress } from '@mui/material';

const CheckoutCard = () => {
  const [totalCheckout, setTotalCheckout] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useQuery({
    queryKey: ['todayCheckoutPaidReports'],
    queryFn: async () => {
      setIsLoading(true);
      const { from, to } = getOperationalHours();

      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/reports?from=${from}&to=${to}&status=${ReportStatus.PAID}&type=${ReportType.CHECKOUT}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        });

        setTotalCheckout(getTotalPayment(res.data.data));
        setIsLoading(false);

        return res.data.data;
      } catch (err) {
        return [];
      }
    },
  });

  return (
    <div>
      {isLoading ? (
        <CircularProgress color="success" size={30} />
      ) : (
        <Card icon={<CheckoutIcon className="w-[15px]" />} bgClass={'bg-red-300'} title={`Today's Checkout`} value={Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalCheckout)} borderLeft={true} />
      )}
    </div>
  );
};

export default CheckoutCard;
