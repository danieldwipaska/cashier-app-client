import React, { useState } from 'react';
import Card from './Card';
import { ReactComponent as CardIcon } from '../../../assets/img/icons/card.svg';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getOperationalHours, getTotalPayment } from 'functions/operational.report';
import { ReportStatus, ReportType } from 'configs/utils';
import { CircularProgress } from '@mui/material';

const TopupCard = () => {
  const [totalTopup, setTotalTopup] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useQuery({
    queryKey: ['todayTopupPaidReports'],
    queryFn: async () => {
      setIsLoading(true);
      const { from, to } = getOperationalHours();

      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/reports?from=${from}&to=${to}&status=${ReportStatus.PAID}&type=${ReportType.TOPUP}&type=${ReportType.TOPUP_AND_ACTIVATE}&type=${ReportType.ADJUSTMENT}&pagination=false`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        });

        setTotalTopup(getTotalPayment(res.data.data));

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
        <Card icon={<CardIcon className="w-[15px]" />} bgClass={'bg-green-400'} title={`Today's Top-up`} value={Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalTopup)} />
      )}
    </div>
  );
};

export default TopupCard;
