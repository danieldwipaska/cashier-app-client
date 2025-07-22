import React from 'react';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SectionHeader from 'components/Backoffices/SectionHeader';
import SectionTitle from 'components/Backoffices/SectionTitle';

const ReportDetails = () => {
  // START HOOKS
  const { reportId } = useParams();

  // END HOOKS

  // START QUERIES
  const { data: report } = useQuery({
    queryKey: ['report', reportId],
    queryFn: () =>
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/reports/${reportId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
        .then((res) => {
          console.log(res.data.data); // Debugging line to check the report data
          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  // END QUERIES
  return (
    <Layout>
      <Header title="REPORT DETAILS" />
      <section>
        <SectionHeader title={report?.report_id} />
        <table>
          <tr>
            <th className="text-left">Type</th>
            <td>&ensp;&ensp;:&ensp;</td>
            <td>{report?.type ? report.type : '-'}</td>
          </tr>
          <tr>
            <th className="text-left">Status</th>
            <td>&ensp;&ensp;:&ensp;</td>
            <td>{report?.status ? report.status : '-'}</td>
          </tr>
          <tr>
            <th className="text-left">Customer Name</th>
            <td>&ensp;&ensp;:&ensp;</td>
            <td>{report?.customer_name ? report.customer_name : '-'}</td>
          </tr>
          {report?.customer_id && (
            <tr>
              <th className="text-left">Customer ID</th>
              <td>&ensp;&ensp;:&ensp;</td>
              <td>{report?.customer_id ? report.customer_id : '-'}</td>
            </tr>
          )}
          {report?.customer_id && (
            <tr>
              <th className="text-left">Card Number</th>
              <td>&ensp;&ensp;:&ensp;</td>
              <td>{report?.card_number ? report.card_number : '-'}</td>
            </tr>
          )}

          {report?.customer_id && (
            <tr>
              <th className="text-left">Initial Balance</th>
              <td>&ensp;&ensp;:&ensp;</td>
              <td>{Intl.NumberFormat('id-ID').format(report?.initial_balance)}</td>
            </tr>
          )}

          {report?.customer_id && (
            <tr>
              <th className="text-left">Final Balance</th>
              <td>&ensp;&ensp;:&ensp;</td>
              <td>{Intl.NumberFormat('id-ID').format(report?.final_balance)}</td>
            </tr>
          )}

          <tr>
            <th className="text-left">Total Payment</th>
            <td>&ensp;&ensp;:&ensp;</td>
            <td>{report?.total_payment ? report.total_payment : '-'}</td>
          </tr>
          {!report?.included_tax_service && (
            <tr>
              <th className="text-left">Included Tax and Service</th>
              <td>&ensp;&ensp;:&ensp;</td>
              <td>{report?.included_tax_service ? 'Yes' : 'No'}</td>
            </tr>
          )}

          {!report?.included_tax_service && (
            <tr>
              <th className="text-left">Service Percent</th>
              <td>&ensp;&ensp;:&ensp;</td>
              <td>{Intl.NumberFormat('id-ID').format(report?.service_percent)}</td>
            </tr>
          )}
          {!report?.included_tax_service && (
            <tr>
              <th className="text-left">Tax Percent</th>
              <td>&ensp;&ensp;:&ensp;</td>
              <td>{Intl.NumberFormat('id-ID').format(report?.tax_percent)}</td>
            </tr>
          )}
          {!report?.included_tax_service && (
            <tr>
              <th className="text-left">Total Tax</th>
              <td>&ensp;&ensp;:&ensp;</td>
              <td>{Intl.NumberFormat('id-ID').format(report?.total_tax)}</td>
            </tr>
          )}
          {!report?.included_tax_service && (
            <tr>
              <th className="text-left">Total Payment after Tax and Service</th>
              <td>&ensp;&ensp;:&ensp;</td>
              <td>{Intl.NumberFormat('id-ID').format(report?.total_payment_after_tax_service)}</td>
            </tr>
          )}
          <tr>
            <th className="text-left">Note</th>
            <td>&ensp;&ensp;:&ensp;</td>
            <td>{report?.note ? report.note : '-'}</td>
          </tr>
        </table>
      </section>
      {report?.Item && report?.Item.length && (
        <section className="mt-5">
          <SectionTitle title="Items" />
          <table className="w-full">
            <tr className="bg-green-300">
              <th className="border-b-4 py-3 px-2 text-left">Fnb</th>
              <th className="border-b-4 py-3 px-2 text-left">Amount</th>
              <th className="border-b-4 py-3 px-2 text-left">Refunded Amount</th>
              <th className="border-b-4 py-3 px-2 text-left">Discount Percent</th>
              <th className="border-b-4 py-3 px-2 text-left">Price</th>
            </tr>
            {report?.Item?.map((item: any) => {
              return (
                <tr key={item.id} className="border-b-2 hover:bg-gray-100 duration-200">
                  <td className="py-3 px-2">{item.fnb.name}</td>
                  <td className="py-3 px-2">{item.amount}</td>
                  <td className="py-3 px-2">{item.refunded_amount}</td>
                  <td className="py-3 px-2">{item.discount_percent} %</td>
                  <td className="py-3 px-2">{Intl.NumberFormat('id-ID').format(item?.price)}</td>
                </tr>
              );
            })}
          </table>
        </section>
      )}
    </Layout>
  );
};

export default ReportDetails;
