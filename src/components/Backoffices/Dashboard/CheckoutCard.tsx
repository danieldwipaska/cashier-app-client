import { useState } from 'react';
import { ReactComponent as CheckoutIcon } from '../../../assets/img/icons/checkout.svg';
import Card from './Card';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getOperationalHours, getTotalPayment } from 'functions/operational.report';
import { ReportStatus, ReportType } from 'configs/utils';

const CheckoutCard = () => {
  const [totalCheckout, setTotalCheckout] = useState(0);

  useQuery({
    queryKey: ['todayCheckoutPaidReports'],
    queryFn: () => {
      const { from, to } = getOperationalHours();

      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/reports?from=${from}&to=${to}&status=${ReportStatus.PAID}&type=${ReportType.CHECKOUT}`)
        .then((res) => {
          setTotalCheckout(getTotalPayment(res.data.data));

          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        });
    },
  });

  return (
    <div>
      <Card icon={<CheckoutIcon className="w-[15px]" />} bgClass={'bg-red-300'} title={`Today's Checkout`} value={Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalCheckout)} borderLeft={true} />
    </div>
  );
};

export default CheckoutCard;
