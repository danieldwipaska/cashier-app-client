import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useForm } from 'react-hook-form';
import { CATEGORIES_QUERY_KEY, ErrorMessage } from 'configs/utils';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useMessages } from 'context/MessageContext';
import { useState } from 'react';
import formatNumber from 'functions/format.number';

const ProductAdd = () => {
  const { showMessage } = useMessages();

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  // START STATES
  const [price, setPrice] = useState(0);
  const [formattedPrice, setFormattedPrice] = useState<string>('');
  // END STATES

  // START FUNCTIONS
  const handleChangePrice = (event: any) => {
    const input = event.target.value;
    const rawNumber = input.replace(/\./g, '');

    setFormattedPrice(formatNumber(rawNumber));
    setPrice(Number(rawNumber));
  };
  // END FUNCTIONS

  // START QUERIES
  const { data: categories } = useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/categories`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  // END QUERIES

  const onSubmit = (data: any) => {
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/fnbs`,
        {
          ...data,
          price: Number(price),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        }
      )
      .then((res) => {
        showMessage('Product added successfully', 'success');
        return navigate('/backoffices/products', { replace: true });
      })
      .catch((error) => {
        if (error?.response?.data?.statusCode === 404) return showMessage(ErrorMessage.PRODUCT_NOT_FOUND, 'error');
        if (error?.response?.data?.statusCode === 500) return showMessage(ErrorMessage.INTERNAL_SERVER_ERROR, 'error');
        if (error?.response?.data?.statusCode === 400) return showMessage(ErrorMessage.BAD_REQUEST, 'error');
        if (error?.response?.data?.statusCode === 401) return showMessage(error.response?.data?.message, 'error');
        return showMessage(ErrorMessage.UNEXPECTED_ERROR, 'error');
      });
  };

  return (
    <Layout>
      <Header title="ADD PRODUCT" />
      <section>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 max-w-[300px] items-center">
              <label className="" htmlFor="name">
                Name
              </label>
              <input type="text" className="border px-3 py-2 rounded-lg" id="name" {...register('name')} placeholder="ex. Nasi Goreng" required />
            </div>
            <div className="grid grid-cols-2 max-w-[300px] items-center">
              <label className="" htmlFor="price">
                Price
              </label>
              <input type="number" className="border px-3 py-2 rounded-lg" id="price" placeholder="ex. 25000" value={formattedPrice} onChange={handleChangePrice} required />
            </div>
            <div className="grid grid-cols-2 max-w-[300px] items-center">
              <label className="" htmlFor="categoryId">
                Category
              </label>
              <select {...register('category_id')} id="categoryId" className="border px-3 py-2 rounded-lg" required>
                <option value="">----</option>
                {categories?.map((category: any) => {
                  return (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <br />
            <br />
            <div>
              <button type="submit" className="bg-green-300 py-2 px-3 rounded-lg">
                Submit
              </button>
            </div>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default ProductAdd;
