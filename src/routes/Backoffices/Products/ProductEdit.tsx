import React, { useState } from 'react';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import style from '../../../assets/css/style.module.css';
import axios from 'axios';
import { API_BASE_URL, CATEGORIES_QUERY_KEY, PRODUCT_QUERY_KEY } from 'configs/utils';
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
        .get(`${API_BASE_URL}/categories`)
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  const { data: product } = useQuery({
    queryKey: PRODUCT_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${API_BASE_URL}/fnbs/${productId}`)
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
      .patch(`${API_BASE_URL}/fnbs/${productId}`, {
        name,
        price: Number(price),
        categoryId: category,
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
        <div className={style.productCreation}>
          <div className={style.formInput}>
            <label className={style.inputLabel} htmlFor="name">
              Name
            </label>
            <input type="text" className={style.input} id="name" placeholder="ex. Nasi Goreng" value={name} onChange={handleNameChange} required />
          </div>
          <div className={style.formInput}>
            <label className={style.inputLabel} htmlFor="price">
              Price
            </label>
            <input type="number" className={style.input} id="price" placeholder="ex. 25000" value={price} onChange={handlePriceChange} required />
          </div>
          <div className={style.formInput}>
            <label className={style.inputLabel} htmlFor="categoryId">
              Category
            </label>
            <select id="categoryId" className={style.input} value={category} onChange={handleCategoryChange} required>
              {categories?.map((category: any) => {
                return (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className={style.formInput}>
            <label className={style.inputLabel} htmlFor="discountStatus">
              Discount Status
            </label>
            <input type="checkbox" className={style.input} id="discountStatus" checked={discountStatus} onChange={handleDiscountStatusChange} required />
          </div>
          <div className={style.formInput}>
            <label className={style.inputLabel} htmlFor="discountPercent">
              Discount Percent
            </label>
            <input type="number" className={style.input} id="discountPercent" placeholder="ex. 20" value={discountPercent} onChange={handleDiscountPercentChange} required />
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

export default ProductEdit;
