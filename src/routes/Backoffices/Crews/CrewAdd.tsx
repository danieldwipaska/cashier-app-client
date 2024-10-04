import React from 'react';
import Layout from '../Layout/Layout';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, Role } from 'lib/utils';
import Header from 'components/Backoffices/Header';
import style from '../../../assets/css/style.module.css';

const CrewAdd = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    axios
      .post(`${API_BASE_URL}/crews`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      })
      .then((res) => {
        return navigate('/backoffices/crews', { replace: true });
      })
      .catch((err) => {
        return console.log(err);
      });
  };

  return (
    <Layout>
      <Header title="ADD CREW" />
      <section>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={style.productCreation}>
            <div className={style.formInput}>
              <label className={style.inputLabel} htmlFor="name">
                Name
              </label>
              <input type="text" className={style.input} id="name" {...register('name')} placeholder="ex. Bambang" required />
            </div>
            <div className={style.formInput}>
              <label className={style.inputLabel} htmlFor="position">
                Position
              </label>
              <select className={style.input} id="position" {...register('position')} required>
                <option value={Role.SERVER}>Server</option>
                <option value={Role.BARTENDER}>Bartender</option>
                <option value={Role.ADMIN}>Admin</option>
              </select>
            </div>
            <div className={style.formInput}>
              <label className={style.inputLabel} htmlFor="code">
                Code/Password
              </label>
              <input type="password" className={style.input} id="code" {...register('code')} placeholder="number only" required />
            </div>
            <br />
            <br />
            <button type="submit" className={style.submitButton}>
              Submit
            </button>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default CrewAdd;
