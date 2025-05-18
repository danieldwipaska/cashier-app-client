import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { ReportStatus, ReportType } from 'configs/utils';
import { processMonthlySales } from 'functions/date-fns.report';
import { getMonthlyOperationalHours } from 'functions/operational.report';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
};

const DailyPurchaseLineChart = () => {
  const [reports, setReports] = useState<any[]>([]);

  useQuery({
    queryKey: ['monthlyPaidReports'],
    queryFn: () => {
      const { from, to } = getMonthlyOperationalHours();

      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/reports?from=${from}&to=${to}&status=${ReportStatus.PAID}&type=${ReportType.PAY}&pagination=false`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
        .then((res) => {
          setReports(res.data.data);

          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        });
    },
  });

  const labels = Object.keys(processMonthlySales(reports));
  const values = Object.values(processMonthlySales(reports));

  const data = {
    labels,
    datasets: [
      {
        label: 'Daily Purchase',
        data: values,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return <Line options={options} data={data} width={100} height={200} />;
};

export default DailyPurchaseLineChart;
