import React from 'react';
import Layout from '../Layout/Layout';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, Role } from 'lib/utils';
import Header from 'components/Backoffices/Header';
import style from '../../../assets/css/style.module.css';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const CrewAdd = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
    position: Yup.string().required('Position is required'),
    code: Yup.string().required('Code is required').matches(/^\d+$/, 'Code must be numeric'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data: any) => {
    axios
      .post(`${API_BASE_URL}/crews`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      })
      .then((res) => {
        reset();
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
              <div>
                <input type="text" className={style.input} id="name" {...register('name')} placeholder="ex. Bambang" required />
                <p className={style.error}>{errors.name?.message}</p>
              </div>
            </div>
            <div className={style.formInput}>
              <label className={style.inputLabel} htmlFor="position">
                Position
              </label>
              <div>
                <select className={style.input} id="position" {...register('position')} required>
                  <option value={Role.SERVER}>Server</option>
                  <option value={Role.BARTENDER}>Bartender</option>
                  <option value={Role.ADMIN}>Admin</option>
                </select>
                <p className={style.error}>{errors.position?.message}</p>
              </div>
            </div>
            <div className={style.formInput}>
              <label className={style.inputLabel} htmlFor="code">
                Code
              </label>
              <div>
                <input type="text" className={style.input} id="code" {...register('code')} placeholder="number only" required />
                <p className={style.error}>{errors.code?.message}</p>
              </div>
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
