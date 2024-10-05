import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL, SINGLE_CATEGORY_QUERY_KEY } from 'lib/utils';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import style from '../../../assets/css/style.module.css';

const CategoryEdit = () => {
  // START HOOKS
  const navigate = useNavigate();
  const { categoryId } = useParams();
  // START HOOKS

  // START HOOKS
  const [name, setName] = useState('');
  // END HOOKS

  // START CHANGE
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  // END CHANGE

  // START QUERIES
  const { data: category } = useQuery({
    queryKey: SINGLE_CATEGORY_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${API_BASE_URL}/categories/${categoryId}`)
        .then((res) => {
          setName(res.data.data.name);

          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  // END QUERIES

  const onSubmit = () => {
    axios
      .patch(`${API_BASE_URL}/categories/${categoryId}`, {
        name,
      })
      .then((res) => {
        return navigate('/backoffices/categories', { replace: true });
      })
      .catch((err) => {
        return console.log(err);
      });
  };

  return (
    <Layout>
      <Header title="EDIT CATEGORY" />
      <section>
        <div className={style.productCreation}>
          <div className={style.formInput}>
            <label className={style.inputLabel} htmlFor="name">
              Name
            </label>
            <input type="text" className={style.input} id="name" placeholder="ex. Appetizer" value={name} onChange={handleNameChange} required />
          </div>
          <br />
          <br />
          <button className={style.submitButton} onClick={onSubmit}>
            Submit
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default CategoryEdit;
