import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ReportType, reportTypeDisplay } from 'configs/utils';
import { getOperationalHours } from 'functions/operational.report';
import { useState } from 'react';

const AdjustmentSummary = ({ title, keys }: { title: string; keys: ReportType[] }) => {
  const [summaryData, setSummaryData] = useState(0);
  const [adjustmentCount, setAdjustmentCount] = useState(0);

  useQuery({
    queryKey: ['adjustmentSummary'],
    queryFn: async () => {
      const { from, to } = getOperationalHours();
      let url = `${process.env.REACT_APP_API_BASE_URL}/reports?from=${from}&to=${to}`;

      keys.forEach((key) => {
        url += `&type=${key}`;
      });

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        });

        let count = 0;

        const groupedData = response.data.data.reduce((acc: any, report: any) => {
          let paymentMethod = report.method?.name;
          
          if (!paymentMethod) {
            count += 1;
            paymentMethod = reportTypeDisplay[ReportType.ADJUSTMENT];
          }

          if (!acc[paymentMethod]) {
            acc[paymentMethod] = {
              totalPayment: 0,
            };
          }

          acc[paymentMethod].totalPayment += report.total_payment_after_tax_service;

          return acc;
        }, {});

        setSummaryData(groupedData);
        setAdjustmentCount(count);

        return groupedData;
      } catch (error) {
        console.error('Error fetching reports:', error);
        throw error;
      }
    },
  });

  return (
    <div className="border border-gray-200 shadow-sm min-w-80">
      <div className="border-b border-gray-200 p-3 bg-green-300">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="overflow-y-auto h-40">
        {Object.entries(summaryData)?.map(([paymentMethod, payment]) => {
          return (
            <div className="flex items-center justify-between gap-3 border-b border-gray-200 py-2 hover:bg-gray-200 px-3">
              <p className="font-medium">{paymentMethod} ({adjustmentCount})</p>
              <div className="flex items-center">
                <p className="text-sm text-green-900">{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(payment.totalPayment)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdjustmentSummary;
