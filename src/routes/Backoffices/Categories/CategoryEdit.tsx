import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CATEGORY_QUERY_KEY } from 'configs/utils';
import { useState } from 'react';
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
  useQuery({
    queryKey: CATEGORY_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/categories/${categoryId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
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
      .patch(
        `${process.env.REACT_APP_API_BASE_URL}/categories/${categoryId}`,
        {
          name,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        }
      )
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
          <button className="bg-green-300 py-2 px-3 rounded-lg" onClick={onSubmit}>
            Submit
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default CategoryEdit;
