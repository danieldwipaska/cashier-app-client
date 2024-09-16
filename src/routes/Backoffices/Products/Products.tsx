import Layout from '../Layout/Layout';
import Header from '../../../components/Backoffices/Header';
import style from '../../../assets/css/style.module.css';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import cx from 'classnames';

const Products = () => {
  // START QUERIES
  const { data: products, refetch: productsRefetch } = useQuery({
    queryKey: ['products'],
    queryFn: () =>
      axios
        .get('http://localhost:3001/fnbs')
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
      <Header title="PRODUCTS" />
      <section>
        <table className={style.table}>
          <tr className={style.tableRowHead}>
            <th className={style.alignLeft}>Product Name</th>
            <th className={style.alignLeft}>Availability</th>
            <th className={style.alignLeft}>Price</th>
            <th className={style.alignLeft}>Category</th>
            <th className={style.alignLeft}>Action</th>
          </tr>
          {products?.map((product: any) => {
            return (
              <tr className={style.tableRow}>
                <td className={style.tableCellLink}>
                  <a href={`/backoffices/products/${product.id}`}>{product.name}</a>
                </td>
                <td className={style.tableCell}>{product.availability ? 'available' : 'out of stock'}</td>
                <td className={style.tableCell}>{Intl.NumberFormat('id-ID').format(product.price)}</td>
                <td className={style.tableCell}>{product.category.name}</td>
                <td className={style.tableCell}></td>
              </tr>
            );
          })}
        </table>
      </section>
    </Layout>
  );
};

export default Products;
