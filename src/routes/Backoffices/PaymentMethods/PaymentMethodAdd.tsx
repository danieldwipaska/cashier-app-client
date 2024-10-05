import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { API_BASE_URL, Role } from 'lib/utils';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import style from '../../../assets/css/style.module.css';

const PaymentMethodAdd = () => {
  // START STATE
  const [isLoading, setIsLoading] = useState(false);
  // END STATE

  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Method Name is required').min(2, 'Name must be at least 2 characters'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access-token');
      if (!token) {
        throw new Error('No access token found');
      }
      await axios.post(`${API_BASE_URL}/methods`, data);

      navigate('/backoffices/methods', { replace: true });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Header title="ADD PAYMENT METHOD" />
      <section>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={style.productCreation}>
            <div className={style.formInput}>
              <label className={style.inputLabel} htmlFor="name">
                Method Name
              </label>
              <div>
                <input type="text" className={style.input} id="name" {...register('name')} placeholder="ex. BCA (Transfer)" required />
                <p className={style.error}>{errors.name?.message}</p>
              </div>
            </div>
            <br />
            <br />
            <button type="submit" className={style.submitButton}>
              Submit {isLoading ? <span className={style.spinner}></span> : null}
            </button>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default PaymentMethodAdd;
