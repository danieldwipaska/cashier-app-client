import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { REPORTS_QUERY_KEY } from 'configs/utils';
import { useEffect, useState } from 'react';
import Pagination from 'components/Pagination';

const Reports = () => {
  // START STATES
  const [searchByServer, setSearchByServer] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [server, setServer] = useState('');
  const [page, setPage] = useState(1);
  // END STATES

  // START QUERIES
  const { data: reports, refetch: reportsRefetch } = useQuery({
    queryKey: REPORTS_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/reports?${customerName ? 'customer_name=' + customerName : ''}&${server ? 'served_by=' + server : ''}&page=${page}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          if (err.status === 404) return [];
          return console.log(err);
        }),
  });
  // END QUERIES

  useEffect(() => {
    reportsRefetch();
    window.scrollTo(0, 0);
  }, [page, reportsRefetch]);

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
        <div className="flex justify-end w-full">
          <div className="search-wrapper">
            <div className="mb-2 flex gap-2">
              <button
                className={`py-1 px-3 border border-green-300 ${searchByServer ? 'bg-green-300' : null} text-xs rounded-full duration-200`}
                onClick={() => {
                  setCustomerName('');
                  setSearchByServer(true);
                }}
              >
                Search by server
              </button>
              <button
                className={`py-1 px-3 border border-green-300 ${searchByServer ? null : 'bg-green-300'} text-xs rounded-full duration-200`}
                onClick={() => {
                  setServer('');
                  setSearchByServer(false);
                }}
              >
                Search by customer name
              </button>
            </div>
            <div className="flex justify-end mb-5">
              <div className={`flex gap-2 ${searchByServer ? 'hidden' : null}`}>
                <input type="text" className="border border-gray-400 px-3 py-2 rounded-lg max-w-52" id="search" placeholder="customer name" value={customerName} onChange={handleChangeCustomerName} />
                <button className="bg-green-300 py-2 px-3 rounded-lg" onClick={handleSubmitSearch}>
                  Search
                </button>
              </div>
              <div className={`flex gap-2 ${searchByServer ? null : 'hidden'}`}>
                <input type="text" className="border border-gray-400 px-3 py-2 rounded-lg max-w-52" id="search" placeholder="server" value={server} onChange={handleChangeServer} />
                <button className="bg-green-300 py-2 px-3 rounded-lg" onClick={handleSubmitSearch}>
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
        <table className="w-full mb-5">
          <tr className="bg-green-300">
            <th className="border-b-4 py-3 text-left px-2">Number</th>
            <th className="border-b-4 py-3 text-left px-2">Type</th>
            <th className="border-b-4 py-3 text-left px-2">Status</th>
            <th className="border-b-4 py-3 text-left px-2">Customer</th>
            <th className="border-b-4 py-3 text-left px-2">Customer ID (phone)</th>
            <th className="border-b-4 py-3 text-left px-2">Payment</th>
            <th className="border-b-4 py-3 text-left px-2">Served By</th>
            <th className="border-b-4 py-3 text-left px-2">Date</th>
            <th className="border-b-4 py-3 text-left px-2">Time</th>
          </tr>
          {reports?.data?.map((report: any) => {
            return (
              <tr key={report.id} className="border-b-2 hover:bg-gray-100 duration-200">
                <td className="py-3 text-sm px-2">{report.report_id}</td>
                <td className="py-3 text-sm px-2">{report.type}</td>
                <td className="py-3 text-sm px-2">{report.status}</td>
                <td className="py-3 text-sm px-2">{report.customer_name}</td>
                <td className="py-3 text-sm px-2">{report.customer_id ? report.customer_id : '-'}</td>
                <td className="py-3 text-sm px-2">{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(report.total_payment_after_tax_service)}</td>
                <td className="py-3 text-sm px-2">{report.served_by}</td>
                <td className="py-3 text-sm px-2">{new Date(report.created_at).toLocaleDateString('id-ID')}</td>
                <td className="py-3 text-sm px-2">{new Date(report.created_at).toLocaleTimeString()}</td>
              </tr>
            );
          })}
        </table>
        <Pagination setPage={setPage} pageMetaData={reports?.pageMetaData} />
      </section>
    </Layout>
  );
};

export default Reports;
