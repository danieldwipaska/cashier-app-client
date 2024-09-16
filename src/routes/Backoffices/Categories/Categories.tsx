import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import style from '../../../assets/css/style.module.css';
import { API_BASE_URL, CATEGORIES_QUERY_KEY } from 'configs/utils';

const Categories = () => {
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

  // END QUERIES

  return (
    <Layout>
      <Header title="CATEGORIES" />
      <section>
        <table className={style.table}>
          <tr className={style.tableRowHead}>
            <th className={style.alignLeft}>Category Name</th>
            <th className={style.alignLeft}>Total Product</th>
            <th className={style.alignLeft}>Action</th>
          </tr>
          {categories?.map((category: any) => {
            return (
              <tr key={category.id} className={style.tableRow}>
                <td className={style.tableCell}>{category.name}</td>
                <td className={style.tableCell}>{category.Fnbs.length}</td>
                <td className={style.tableCell}></td>
              </tr>
            );
          })}
        </table>
      </section>
    </Layout>
  );
};

export default Categories;
