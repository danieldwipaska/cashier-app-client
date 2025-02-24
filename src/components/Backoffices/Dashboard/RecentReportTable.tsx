import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ReportStatus, ReportType } from 'configs/utils';
import { getOperationalHours } from 'functions/operational.report';
import React, { useState } from 'react';

const RecentReportTable = () => {
  const [dailyReports, setDailyReports] = useState([]);

  useQuery({
    queryKey: ['dailyReports'],
    queryFn: () => {
      const { from, to } = getOperationalHours();

      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/reports?from=${from}&to=${to}&status=${ReportStatus.PAID}&type=${ReportType.PAY}`)
        .then((res) => {
          setDailyReports(res.data.data);
        })
        .catch((err) => {
          return console.log(err);
        });
    },
  });

  return (
      <table className="w-full">
        <thead className="bg-green-300 sticky top-0">
          <th className="border-b-4 py-3 text-left px-2">Number</th>
          <th className="border-b-4 py-3 text-left px-2">Status</th>
          <th className="border-b-4 py-3 text-left px-2">Customer</th>
          <th className="border-b-4 py-3 text-left px-2">Payment</th>
          <th className="border-b-4 py-3 text-left px-2">Served By</th>
          <th className="border-b-4 py-3 text-left px-2">Time</th>
        </thead>
        <tbody>
          {dailyReports?.map((report: any) => {
            return (
              <tr key={report.id} className="border-b-2 hover:bg-gray-100 duration-200">
                <td className="py-3 text-sm px-2">{report.report_id}</td>
                <td className="py-3 text-sm px-2">{report.status}</td>
                <td className="py-3 text-sm px-2">{report.customer_name}</td>
                <td className="py-3 text-sm px-2">{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(report.total_payment_after_tax_service)}</td>
                <td className="py-3 text-sm px-2">{report.served_by}</td>
                <td className="py-3 text-sm px-2">{new Date(report.created_at).toLocaleTimeString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
  );
};

export default RecentReportTable;
