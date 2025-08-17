import React, { useState } from 'react';
import { ReactComponent as ReceiptIcon } from '../../../assets/img/icons/receipt.svg';
import Card from './Card';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getOperationalHours } from 'functions/operational.report';
import { ReportStatus, ReportType } from 'configs/utils';
import { CircularProgress } from '@mui/material';

const TotalTransactionCard = () => {
  const [totalTransaction, setTotalTransaction] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useQuery({
    queryKey: ['todayPaidReports'],
    queryFn: async () => {
      setIsLoading(true);
      const { from, to } = getOperationalHours();

      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/reports?from=${from}&to=${to}&status=${ReportStatus.PAID}&type=${ReportType.PAY}&pagination=false`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        });

        setTotalTransaction(res.data.data.length);
        setIsLoading(false);

        return res.data.data;
      } catch (err) {
        return [];
      }
    },
  });

  return (
    <div>{isLoading ? <CircularProgress color="success" size={30} /> : <Card icon={<ReceiptIcon className="w-[15px]" />} bgClass={'bg-yellow-200'} title={`Today's Transaction`} value={totalTransaction.toString()} borderLeft={true} />}</div>
  );
};

export default TotalTransactionCard;
