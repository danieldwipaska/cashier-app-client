import React, { useState } from 'react';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import axios from 'axios';
import { CATEGORIES_QUERY_KEY, ErrorMessage, PRODUCT_QUERY_KEY } from 'configs/utils';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useMessages } from 'context/MessageContext';

const ProductEdit = () => {
  // START HOOKS
  const navigate = useNavigate();
  const { productId } = useParams();
  const { showMessage } = useMessages();
  // START HOOKS

  // START HOOKS
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [discountStatus, setDiscountStatus] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [activeStatus, setActiveStatus] = useState(false);
  // END HOOKS

  // START CHANGE
  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };

  const handlePriceChange = (event: any) => {
    setPrice(event.target.value);
  };

  const handleCategoryChange = (event: any) => {
    setCategory(event.target.value);
  };

  const handleDiscountStatusChange = (event: any) => {
    setDiscountStatus(event.target.checked);
  };

  const handleDiscountPercentChange = (event: any) => {
    setDiscountPercent(event.target.value);
  };
  const handleActiveStatusChange = (event: any) => {
    setActiveStatus(event.target.checked);
  };
  // END CHANGE

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

  useQuery({
    queryKey: PRODUCT_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/fnbs/${productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
        .then((res) => {
          setName(res.data.data.name);
          setPrice(res.data.data.price);
          setCategory(res.data.data.category.id);
          setDiscountStatus(res.data.data.discount_status);
          setDiscountPercent(res.data.data.discount_percent);
          setActiveStatus(res.data.data.is_active);

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
        `${process.env.REACT_APP_API_BASE_URL}/fnbs/${productId}`,
        {
          name,
          price: Number(price),
          category_id: category,
          discount_status: discountStatus,
          discount_percent: Number(discountPercent),
          is_active: activeStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        }
      )
      .then((res) => {
        showMessage('Product updated successfully', 'success');
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
      <Header title="EDIT PRODUCT" />
      <section>
        <div className="">
          <div className="grid grid-cols-2 max-w-[380px] py-3 items-center">
            <label className="" htmlFor="name">
              Name
            </label>
            <input type="text" className="border px-3 py-2 rounded-lg" id="name" placeholder="ex. Nasi Goreng" value={name} onChange={handleNameChange} required />
          </div>
          <div className="grid grid-cols-2 max-w-[380px] py-3 items-center">
            <label className="" htmlFor="price">
              Price
            </label>
            <input type="number" className="border px-3 py-2 rounded-lg" id="price" placeholder="ex. 25000" value={price} onChange={handlePriceChange} required />
          </div>
          <div className="grid grid-cols-2 max-w-[380px] py-3 items-center">
            <label className="" htmlFor="categoryId">
              Category
            </label>
            <select id="categoryId" className="border px-3 py-2 rounded-lg" value={category} onChange={handleCategoryChange} required>
              {categories?.map((category: any) => {
                return (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="grid grid-cols-2 max-w-[380px] py-3 items-center justify-items-start">
            <label className="" htmlFor="discountStatus">
              Discount Status
            </label>
            <input type="checkbox" className=" w-6 h-6" id="discountStatus" checked={discountStatus} onChange={handleDiscountStatusChange} required />
          </div>
          <div className="grid grid-cols-2 max-w-[380px] py-3 items-center">
            <label className="" htmlFor="discountPercent">
              Discount Percent
            </label>
            <input type="number" className="border px-3 py-2 rounded-lg" id="discountPercent" placeholder="ex. 20" value={discountPercent} onChange={handleDiscountPercentChange} required />
          </div>
          <div className="grid grid-cols-2 max-w-[380px] py-3 items-center justify-items-start">
            <label className="" htmlFor="activeStatus">
              Active
            </label>
            <input type="checkbox" className=" w-6 h-6" id="activeStatus" checked={activeStatus} onChange={handleActiveStatusChange} />
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

export default ProductEdit;
