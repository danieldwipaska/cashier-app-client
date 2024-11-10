import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL, CATEGORY_QUERY_KEY } from 'configs/utils';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';

const CategoryEdit = () => {
  // START HOOKS
  const navigate = useNavigate();
  const { categoryId } = useParams();
  // START HOOKS

  // START HOOKS
  const [name, setName] = useState('');
  // END HOOKS

  // START CHANGE
  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };
  // END CHANGE

  // START QUERIES
  const { data: category } = useQuery({
    queryKey: CATEGORY_QUERY_KEY,
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
        <div className="">
          <div className="grid grid-cols-2 max-w-[200px] py-3 items-center">
            <label className="" htmlFor="name">
              Name
            </label>
            <input type="text" className="border px-3 py-2 rounded-lg" id="name" placeholder="ex. Appetizer" value={name} onChange={handleNameChange} required />
          </div>
          <br />
          <br />
          <button className="bg-green-500 py-2 px-3 rounded-lg" onClick={onSubmit}>
            Submit
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default CategoryEdit;
