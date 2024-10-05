import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL, REPORTS_QUERY_KEY } from 'lib/utils';
import { useForm } from 'react-hook-form';
import style from '../../../assets/css/style.module.css';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';

const Reports = () => {
  // START HOOKS
  const { register, handleSubmit } = useForm();
  // END HOOKS

  // START QUERY
  const { data: reports, refetch: reportsRefetch } = useQuery({
    queryKey: REPORTS_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${API_BASE_URL}/reports`)
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });
  // END QUERY

  // START CSS
  const tableClass = `${style.table} ${style.mt20}`;
  // END CSS

  return (
    <Layout>
      <Header title="REPORTS" />
      <section>
        <table className={tableClass}>
          <tr className={style.tableRowHead}>
            <th className={style.alignLeft}>Number</th>
            <th className={style.alignLeft}>Type</th>
            <th className={style.alignLeft}>Status</th>
            <th className={style.alignLeft}>Customer Name</th>
            <th className={style.alignLeft}>Served By</th>
            <th className={style.alignLeft}>Date</th>
            <th className={style.alignLeft}>Time</th>
          </tr>
          {reports?.map((report: any) => {
            return (
              <tr key={report.id} className={style.tableRow}>
                <td className={style.tableCell}>{report.report_id}</td>
                <td className={style.tableCell}>{report.type}</td>
                <td className={style.tableCell}>{report.status}</td>
                <td className={style.tableCell}>{report.customer_name}</td>
                <td className={style.tableCell}>{report.served_by}</td>
                <td className={style.tableCell}>{new Date(report.updated_at).toLocaleDateString()}</td>
                <td className={style.tableCell}>{new Date(report.updated_at).toLocaleTimeString()}</td>
              </tr>
            );
          })}
        </table>
      </section>
    </Layout>
  );
};

export default Reports;
