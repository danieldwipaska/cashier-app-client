import React from 'react';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import SectionHeader from 'components/Backoffices/SectionHeader';
import style from '../../../assets/css/style.module.css';
import cx from 'classnames';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  // START HOOKS
  const { productId } = useParams();

  // END HOOKS

  // START CSS
  const tableRowHeadClass = cx(style.detailTableRowHead, style.alignLeft);

  // END CSS

  // START QUERIES
  const { data: product, refetch: productRefetch } = useQuery({
    queryKey: ['product'],
    queryFn: () =>
      axios
        .get(`http://localhost:3001/fnbs/${[productId]}`)
        .then((res) => {
          console.log(res.data.data);
          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  // END QUERIES

  return (
    <Layout>
      <Header title="PRODUCT DETAILS" />
      <section>
        <SectionHeader title={product?.name} />
        <table>
          <tr>
            <th className={tableRowHeadClass}>Category</th>
            <td>:&ensp;</td>
            <td>{product?.category.name ? product.category.name : '-'}</td>
          </tr>
          <tr>
            <th className={tableRowHeadClass}>Price</th>
            <td>:&ensp;</td>
            <td>{Intl.NumberFormat('id-ID').format(product?.price)}</td>
          </tr>
          <tr>
            <th className={tableRowHeadClass}>Availability</th>
            <td>:&ensp;</td>
            <td>{product?.availability ? 'Available' : 'Out of Stock'}</td>
          </tr>
          <tr>
            <th className={tableRowHeadClass}>Discount Status</th>
            <td>:&ensp;</td>
            <td>{product?.discount_status ? 'Active' : 'Inactive'}</td>
          </tr>
          <tr>
            <th className={tableRowHeadClass}>Discount Percent</th>
            <td>:&ensp;</td>
            <td>{product?.discount_percent ? product.discount_percent : '-'}</td>
          </tr>
        </table>
      </section>
    </Layout>
  );
};

export default ProductDetails;
