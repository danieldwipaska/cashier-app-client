import React from 'react';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import SectionHeader from 'components/Backoffices/SectionHeader';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  // START HOOKS
  const { productId } = useParams();

  // END HOOKS

  // START QUERIES
  const { data: product } = useQuery({
    queryKey: ['product', productId],
    queryFn: () =>
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/fnbs/${productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
        .then((res) => {
          console.log(res.data.data);
          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  // END QUERIES

  const Buttons = ({ productId }: { productId: string }): JSX.Element => {
    return (
      <a href={`/backoffices/products/${productId}/set-modifier`} className="bg-green-300 py-2 px-3 rounded-lg">Set Modifier</a>
    )
  }

  return (
    <Layout>
      <Header title="PRODUCT DETAILS" />
      <section>
        <SectionHeader title={product?.name} Buttons={<Buttons productId={`${productId}`} />} />
        <table>
          <tr>
            <th className="text-left">Category</th>
            <td>&ensp;&ensp;:&ensp;</td>
            <td>{product?.category.name ? product.category.name : '-'}</td>
          </tr>
          <tr>
            <th className="text-left">Price</th>
            <td>&ensp;&ensp;:&ensp;</td>
            <td>{Intl.NumberFormat('id-ID').format(product?.price)}</td>
          </tr>
          <tr>
            <th className="text-left">Availability</th>
            <td>&ensp;&ensp;:&ensp;</td>
            <td>{product?.availability ? 'Available' : 'Out of Stock'}</td>
          </tr>
          <tr>
            <th className="text-left">Discount Status</th>
            <td>&ensp;&ensp;:&ensp;</td>
            <td>{product?.discount_status ? 'Active' : 'Inactive'}</td>
          </tr>
          <tr>
            <th className="text-left">Discount Percent</th>
            <td>&ensp;&ensp;:&ensp;</td>
            <td>{product?.discount_percent ? product.discount_percent : '-'}</td>
          </tr>
          <tr>
            <th className="text-left">Modifiers</th>
            <td>&ensp;&ensp;:&ensp;</td>
            <td>{product?.FnbModifier.length ? product?.FnbModifier.map((fnbModifier: any) => fnbModifier.modifier.name).join(', ') : '-'}</td>
          </tr>
          <tr>
            <th className="text-left">Status</th>
            <td>&ensp;&ensp;:&ensp;</td>
            <td>{product?.is_active ? 'Active' : 'Inactive'}</td>
          </tr>
        </table>
      </section>
    </Layout>
  );
};

export default ProductDetails;
