import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import cx from 'classnames';
import { API_BASE_URL, CATEGORIES_QUERY_KEY } from 'configs/utils';
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
          if (err.status === 404) return [];
          return console.log(err);
        }),
  });

  // END QUERIES

  return (
    <Layout>
      <Header title="CATEGORIES" />
      <section>
        <div className="mb-5">
          <a href={'/backoffices/categories/add'} className="bg-green-400 py-3 px-5 rounded-lg">
            Add Category
          </a>
        </div>
        <table className="w-2/4">
          <tr className="">
            <th className="border-b-4 py-3 text-left">Category Name</th>
            <th className="border-b-4 py-3 text-left">Total Product</th>
            <th className="border-b-4 py-3 text-left">Action</th>
          </tr>
          {categories?.map((category: any) => {
            return (
              <tr key={category.id} className="border-b-2">
                <td className="py-3">{category.name}</td>
                <td className="py-3">{category.Fnbs.length}</td>
                <td className="py-3">
                  <div className='flex items-center gap-2'>
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
                        })} className='flex items-center'
                      >
                        <input type="hidden" {...register('id')} value={category.id} readOnly />
                        <button type="submit">
                          <img src={deleteIcon} alt="deleteIcon" width={20} />
                        </button>
                      </form>
                    ) : null}
                  </div>
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
