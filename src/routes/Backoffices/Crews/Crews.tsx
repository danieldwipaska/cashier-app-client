import React from 'react';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import style from '../../../assets/css/style.module.css';
import cx from 'classnames';
import { API_BASE_URL, CREWS_QUERY_KEY } from 'lib/utils';
import deleteIcon from '../../../assets/img/icons/icon-delete.svg';
import editIcon from '../../../assets/img/icons/icon-edit.svg';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const Crews = () => {
  // START HOOKS
  const { register, handleSubmit } = useForm();
  // END HOOKS

  // START QUERY
  const { data: crews, refetch: crewsRefetch } = useQuery({
    queryKey: CREWS_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${API_BASE_URL}/crews`)
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
      <Header title="CREWS" />
      <section>
        <div className={style.buttonWrapperLeft}>
          <a href={'/backoffices/crews/add'} className={style.buttonGreen}>
            Add Crew
          </a>
        </div>
        <table className={tableClass}>
          <tr className={style.tableRowHead}>
            <th className={style.alignLeft}>Crew Name</th>
            <th className={style.alignLeft}>Position</th>
            <th className={style.alignLeft}>Action</th>
          </tr>
          {crews?.map((crew: any) => {
            return (
              <tr key={crew.id} className={style.tableRow}>
                <td className={style.tableCell}>{crew.name}</td>
                <td className={style.tableCell}>{crew.position}</td>
                <td className={style.tableCellAction}>
                  <a href={`/backoffices/crews/${crew.id}/edit`}>
                    <img src={editIcon} alt="editIcon" width={20} />
                  </a>
                  <form
                    onSubmit={handleSubmit(() => {
                      axios
                        .delete(`${API_BASE_URL}/crews/${crew.id}`)
                        .then((res) => {
                          return crewsRefetch();
                        })
                        .catch((err) => {
                          return console.log(err);
                        });
                    })}
                  >
                    <input type="hidden" {...register('id')} value={crew.id} readOnly />
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

export default Crews;
