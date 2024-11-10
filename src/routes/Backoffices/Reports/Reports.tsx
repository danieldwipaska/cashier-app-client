import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import cx from 'classnames';
import { API_BASE_URL, REPORTS_QUERY_KEY } from 'configs/utils';
import { useForm } from 'react-hook-form';

const Reports = () => {
  // START HOOKS
  const { register, handleSubmit } = useForm();
  // END HOOKS

  // START QUERIES
  const { data: reports } = useQuery({
    queryKey: REPORTS_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${API_BASE_URL}/reports`)
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          if (err.status === 404) return [];
          return console.log(err);
        }),
  });

  // END QUERIES

  return (
    <Layout>
      <Header title="REPORTS" />
      <section>
        <table className="w-full">
          <tr className="">
            <th className="border-b-4 py-3 text-left">Number</th>
            <th className="border-b-4 py-3 text-left">Type</th>
            <th className="border-b-4 py-3 text-left">Status</th>
            <th className="border-b-4 py-3 text-left">Customer</th>
            <th className="border-b-4 py-3 text-left">Customer ID (phone)</th>
            <th className="border-b-4 py-3 text-left">Served By</th>
            <th className="border-b-4 py-3 text-left">Date</th>
            <th className="border-b-4 py-3 text-left">Time</th>
          </tr>
          {reports?.map((report: any) => {
            return (
              <tr key={report.id} className="border-b-2">
                <td className="py-3">{report.report_id}</td>
                <td className="py-3">{report.type}</td>
                <td className="py-3">{report.status}</td>
                <td className="py-3">{report.customer_name}</td>
                <td className="py-3">{report.customer_id ? report.customer_id : '-'}</td>
                <td className="py-3">{report.served_by}</td>
                <td className="py-3">{new Date(report.created_at).toLocaleDateString('id-ID')}</td>
                <td className="py-3">{new Date(report.created_at).toLocaleTimeString()}</td>
              </tr>
            );
          })}
        </table>
      </section>
    </Layout>
  );
};

export default Reports;
