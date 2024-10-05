import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL, PAYMENT_METHODS_QUERY_KEY } from 'lib/utils';
import React from 'react';
import { useForm } from 'react-hook-form';
import style from '../../../assets/css/style.module.css';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import deleteIcon from '../../../assets/img/icons/icon-delete.svg';

const PaymentMethods = () => {
  // START HOOKS
  const { register, handleSubmit } = useForm();
  // END HOOKS

  // START QUERY
  const { data: paymentMethods, refetch: paymentMethodsRefetch } = useQuery({
    queryKey: PAYMENT_METHODS_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${API_BASE_URL}/methods`)
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
      <Header title="PAYMENT METHODS" />
      <section>
        <div className={style.buttonWrapperLeft}>
          <a href={'/backoffices/methods/add'} className={style.buttonGreen}>
            Add Payment Method
          </a>
        </div>
        <table className={tableClass}>
          <tr className={style.tableRowHead}>
            <th className={style.alignLeft}>Method Name</th>
            <th className={style.alignLeft}>Action</th>
          </tr>
          {paymentMethods?.map((paymentMethod: any) => {
            return (
              <tr key={paymentMethod.id} className={style.tableRow}>
                <td className={style.tableCell}>{paymentMethod.name}</td>
                <td className={style.tableCellAction}>
                  <form
                    onSubmit={handleSubmit(() => {
                      axios
                        .delete(`${API_BASE_URL}/methods/${paymentMethod.id}`)
                        .then((res) => {
                          return paymentMethodsRefetch();
                        })
                        .catch((err) => {
                          return console.log(err);
                        });
                    })}
                  >
                    <input type="hidden" {...register('id')} value={paymentMethod.id} readOnly />
                    <button type="submit">
                      <img src={deleteIcon} alt="deleteIcon" width={20} />
                    </button>
                  </form>
                </td>
              </tr>
            );
          })}
        </table>
      </section>
    </Layout>
  );
};

export default PaymentMethods;
