import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL, REPORTS_QUERY_KEY } from 'configs/utils';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Reports = () => {
  // START HOOKS
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  // END HOOKS

  // START STATES
  const [searchByServer, setSearchByServer] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [server, setServer] = useState('');
  // END STATES

  // START QUERIES
  const { data: reports, refetch: reportsRefetch } = useQuery({
    queryKey: REPORTS_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${API_BASE_URL}/reports?${customerName ? 'customer_name=' + customerName : ''}&${server ? 'served_by=' + server : ''}`)
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          if (err.status === 404) return [];
          return console.log(err);
        }),
  });
  // END QUERIES

  // START FUNCTIONS
  const handleSubmitSearch = async () => {
    return reportsRefetch();
  };

  const handleChangeCustomerName = async (event: any) => {
    setCustomerName(event.target.value);
  };

  const handleChangeServer = async (event: any) => {
    setServer(event.target.value);
  };
  // END FUNCTIONS

  return (
    <Layout>
      <Header title="REPORTS" />
      <section>
        <div className="mb-5 flex gap-2">
          <button
            className={`py-1 px-3 border border-green-500 ${searchByServer ? null : 'bg-green-500'} text-xs rounded-full duration-200`}
            onClick={() => {
              setServer('');
              setSearchByServer(false);
            }}
          >
            Search by customer name
          </button>
          <button
            className={`py-1 px-3 border border-green-500 ${searchByServer ? 'bg-green-500' : null} text-xs rounded-full duration-200`}
            onClick={() => {
              setCustomerName('');
              setSearchByServer(true);
            }}
          >
            Search by server
          </button>
        </div>
        <div className="mb-5 grid grid-cols-3 gap-5">
          <div className={`flex gap-2 ${searchByServer ? 'hidden' : null}`}>
            <input type="text" className="border border-gray-400 px-3 py-2 rounded-lg max-w-44" id="search" placeholder="customer name" value={customerName} onChange={handleChangeCustomerName} />
            <button className="bg-green-500 py-2 px-3 rounded-lg" onClick={handleSubmitSearch}>
              Search
            </button>
          </div>
          <div className={`flex gap-2 ${searchByServer ? null : 'hidden'}`}>
            <input type="text" className="border border-gray-400 px-3 py-2 rounded-lg max-w-44" id="search" placeholder="server" value={server} onChange={handleChangeServer} />
            <button className="bg-green-500 py-2 px-3 rounded-lg" onClick={handleSubmitSearch}>
              Search
            </button>
          </div>
        </div>
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
