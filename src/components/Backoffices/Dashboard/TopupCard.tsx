import React, { useState } from 'react';
import Card from './Card';
import { ReactComponent as CardIcon } from '../../../assets/img/icons/card.svg';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getOperationalHours, getTotalPayment } from 'functions/operational.report';
import { ReportStatus, ReportType } from 'configs/utils';

const TopupCard = () => {
  const [totalTopup, setTotalTopup] = useState(0);

  useQuery({
    queryKey: ['todayTopupPaidReports'],
    queryFn: () => {
      const { from, to } = getOperationalHours();

      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/reports?from=${from}&to=${to}&status=${ReportStatus.PAID}&type=${ReportType.TOPUP}&type=${ReportType.TOPUP_AND_ACTIVATE}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
        .then((res) => {
          setTotalTopup(getTotalPayment(res.data.data));

          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        });
    },
  });
  return (
    <div>
      <Card icon={<CardIcon className="w-[15px]" />} bgClass={'bg-green-400'} title={`Today's Top-up`} value={Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalTopup)} />
    </div>
  );
};

export default TopupCard;
