import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import style from '../../../assets/css/style.module.css';
import cx from 'classnames';
import { API_BASE_URL, CATEGORIES_QUERY_KEY } from 'lib/utils';
import deleteIcon from '../../../assets/img/icons/icon-delete.svg';
import editIcon from '../../../assets/img/icons/icon-edit.svg';
import { useForm } from 'react-hook-form';

const Categories = () => {
  // START HOOKS
  const { register, handleSubmit } = useForm();
  // END HOOKS

  // START QUERIES
  const { data: categories, refetch: categoriesRefetch } = useQuery({
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

  // START CSS
  const tableClass = cx(style.table, style.mt20);
  // END CSS

  return (
    <Layout>
      <Header title="CATEGORIES" />
      <section>
        <div className={style.buttonWrapperLeft}>
          <a href={'/backoffices/categories/add'} className={style.buttonGreen}>
            Add Category
          </a>
        </div>
        <table className={tableClass}>
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
                <td className={style.tableCellAction}>
                  <a href={`/backoffices/categories/${category.id}/edit`}>
                    <img src={editIcon} alt="editIcon" width={20} />
                  </a>
                  {!category.Fnbs.length ? (
                    <form
                      onSubmit={handleSubmit(() => {
                        axios
                          .delete(`${API_BASE_URL}/categories/${category.id}`)
                          .then((res) => {
                            return categoriesRefetch();
                          })
                          .catch((err) => {
                            return console.log(err);
                          });
                      })}
                    >
                      <input type="hidden" {...register('id')} value={category.id} readOnly />
                      <button type="submit">
                        <img src={deleteIcon} alt="deleteIcon" width={20} />
                      </button>
                    </form>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </table>
      </section>
    </Layout>
  );
};

export default Categories;
