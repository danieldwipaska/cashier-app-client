import axios from 'axios';
import { API_BASE_URL } from 'configs/utils';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import style from '../../../assets/css/style.module.css'

const CategoryAdd = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    axios
      .post(`${API_BASE_URL}/categories`, data)
      .then((res) => {
        return navigate('/backoffices/categories', { replace: true });
      })
      .catch((err) => {
        return console.log(err);
      });
  };

  return (
    <Layout>
      <Header title="ADD CATEGORIES" />
      <section>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={style.productCreation}>
            <div className={style.formInput}>
              <label className={style.inputLabel} htmlFor="name">
                Name
              </label>
              <input type="text" className={style.input} id="name" {...register('name')} placeholder="ex. Appetizer" required />
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

export default CategoryAdd;
