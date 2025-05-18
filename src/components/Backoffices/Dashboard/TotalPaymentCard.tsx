import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ReportStatus, ReportType } from 'configs/utils';
import { getOperationalHours, getTotalPayment } from 'functions/operational.report';
import { useState } from 'react';

const TotalPaymentCard = () => {
  const [totalPayment, setTotalPayment] = useState(0);

  useQuery({
    queryKey: ['todaySumPaidReports'],
    queryFn: () => {
      const { from, to } = getOperationalHours();

      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/reports?from=${from}&to=${to}&status=${ReportStatus.PAID}&type=${ReportType.PAY}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
        .then((res) => {
          setTotalPayment(getTotalPayment(res.data.data));

          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        });
    },
  });

  return (
    <div className="px-5 py-3">
      <h5 className="mb-2 text-sm text-gray-500">Today's Successful Payments</h5>
      <p className="text-3xl font-bold">{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalPayment)}</p>
    </div>
  );
};

export default TotalPaymentCard;
