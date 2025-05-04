import React, { useState } from 'react';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import axios from 'axios';
import { CATEGORIES_QUERY_KEY, PRODUCT_QUERY_KEY } from 'configs/utils';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

const ProductEdit = () => {
  // START HOOKS
  const navigate = useNavigate();
  const { productId } = useParams();
  // START HOOKS

  // START HOOKS
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [discountStatus, setDiscountStatus] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
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
  // END CHANGE

  // START QUERIES
  const { data: categories } = useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/categories`)
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
        .get(`${process.env.REACT_APP_API_BASE_URL}/fnbs/${productId}`)
        .then((res) => {
          setName(res.data.data.name);
          setPrice(res.data.data.price);
          setCategory(res.data.data.category.id);
          setDiscountStatus(res.data.data.discount_status);
          setDiscountPercent(res.data.data.discount_percent);

          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  // END QUERIES

  const onSubmit = () => {
    axios
      .patch(`${process.env.REACT_APP_API_BASE_URL}/fnbs/${productId}`, {
        name,
        price: Number(price),
        category_id: category,
        discount_status: discountStatus,
        discount_percent: Number(discountPercent),
      })
      .then((res) => {
        return navigate('/backoffices/products', { replace: true });
      })
      .catch((err) => {
        return console.log(err);
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
