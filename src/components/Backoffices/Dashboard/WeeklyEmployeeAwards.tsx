import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ReportStatus, ReportType } from 'configs/utils';
import { getWeeklyOperationalHours } from 'functions/operational.report';
import { useState } from 'react';

const WeeklyEmployeeAwards = () => {
  const [crewWeeklyPurchases, setCrewWeeklyPurchases] = useState(0);

  useQuery({
    queryKey: ['weeklyCrewReports'],
    queryFn: async () => {
      const { from, to } = getWeeklyOperationalHours();

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/reports?from=${from}&to=${to}&status=${ReportStatus.PAID}`);

        const groupedData = response.data.data.reduce((acc: any, report: any) => {
          const crewName = report.served_by;

          if (!acc[crewName]) {
            acc[crewName] = {
              totalPayment: 0,
              transactions: 0,
              refunded: 0,
            };
          }

          if (report.type === ReportType.PAY || report.type === ReportType.REFUND) {
            acc[crewName].totalPayment += report.total_payment_after_tax_service;
            
            if (report.type === ReportType.PAY) {
              acc[crewName].transactions += 1;

              if (report.refund_status) {
                acc[crewName].refunded += 1;
              }
            }
          }

          return acc;
        }, {});

        setCrewWeeklyPurchases(groupedData);

        return groupedData;
      } catch (error) {
        console.error('Error fetching reports:', error);
        throw error;
      }
    },
  });

  return (
    <div className="border border-gray-200 shadow-sm">
      <div className="border-b border-gray-200 p-3 bg-green-300">
        <h3 className="text-lg font-semibold">Weekly Top Employees</h3>
      </div>
      <div className="overflow-y-auto h-40">
        {Object.entries(crewWeeklyPurchases)?.map(([crewName, payment]) => {
          return (
            <div className="flex items-center justify-between gap-3 border-b border-gray-200 py-2 hover:bg-gray-200 px-3">
              <div className="flex flex-col justify-center">
                <p className="font-medium">{crewName}</p>
                <p className="text-xs text-gray-500">{payment.transactions} Transaction(s), {payment.refunded} Refunded</p>
              </div>
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

export default WeeklyEmployeeAwards;
