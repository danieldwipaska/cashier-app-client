import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CATEGORY_QUERY_KEY, ErrorMessage } from 'configs/utils';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useMessages } from 'context/MessageContext';
import { CircularProgress } from '@mui/material';

const CategoryEdit = () => {
  // START HOOKS
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { showMessage } = useMessages();
  // START HOOKS

  // START STATES
  const [name, setName] = useState('');
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  // END STATES

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
    setSubmitLoading(true);
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
        showMessage('Category updated successfully', 'success');
        return navigate('/backoffices/categories', { replace: true });
      })
      .catch((error) => {
        if (error?.response?.data?.statusCode === 404) return showMessage(ErrorMessage.CATEGORY_NOT_FOUND, 'error');
        if (error?.response?.data?.statusCode === 500) return showMessage(ErrorMessage.INTERNAL_SERVER_ERROR, 'error');
        if (error?.response?.data?.statusCode === 400) return showMessage(ErrorMessage.BAD_REQUEST, 'error');
        if (error?.response?.data?.statusCode === 401) return showMessage(error.response?.data?.message, 'error');
        return showMessage(ErrorMessage.UNEXPECTED_ERROR, 'error');
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  return (
    <Layout>
      <Header title="EDIT CATEGORY" />
      <section>
        <div className="">
          <div className="grid grid-cols-2 max-w-[380px] py-3 items-center">
            <label className="" htmlFor="name">
              Name
            </label>
            <input type="text" className="border px-3 py-2 rounded-lg" id="name" placeholder="ex. Appetizer" value={name} onChange={handleNameChange} required />
          </div>
          <br />
          <br />
          <button className="bg-green-300 py-2 px-3 rounded-lg" onClick={onSubmit} disabled={submitLoading}>
            {submitLoading ? (
              <div className="flex items-center gap-2">
                <p>Loading</p>
                <CircularProgress color="warning" size={15} />
              </div>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default CategoryEdit;
