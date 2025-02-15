import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';

const CategoryAdd = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/categories`, data)
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
          <div className="">
            <div className="grid grid-cols-2 max-w-[300px] items-center">
              <label className="" htmlFor="name">
                Name
              </label>
              <input type="text" className="border px-3 py-2 rounded-lg" id="name" {...register('name')} placeholder="ex. Appetizer" required />
            </div>
            <br />
            <br />
            <button type="submit" className="bg-green-300 py-2 px-3 rounded-lg">
              Submit
            </button>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default CategoryAdd;
