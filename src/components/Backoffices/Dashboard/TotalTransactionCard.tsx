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
    queryFn: () => {
      setIsLoading(true);
      const { from, to } = getOperationalHours();

      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/reports?from=${from}&to=${to}&status=${ReportStatus.PAID}&type=${ReportType.PAY}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
        .then((res) => {
          setTotalTransaction(res.data.data.length);
          setIsLoading(false);

          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        });
    },
  });

  return (
    <div>{isLoading ? <CircularProgress color="success" size={30} /> : <Card icon={<ReceiptIcon className="w-[15px]" />} bgClass={'bg-yellow-200'} title={`Today's Transaction`} value={totalTransaction.toString()} borderLeft={true} />}</div>
  );
};

export default TotalTransactionCard;
