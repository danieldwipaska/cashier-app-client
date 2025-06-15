import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CATEGORIES_QUERY_KEY } from 'configs/utils';
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
        .get(`${process.env.REACT_APP_API_BASE_URL}/categories`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          }
        })
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
          <a href={'/backoffices/categories/add'} className="bg-green-300 py-3 px-5 rounded-lg">
            Add
          </a>
        </div>
        <table className="w-full">
          <tr className="bg-green-200">
            <th className="border-b-4 py-3 px-2 text-left">Category Name</th>
            <th className="border-b-4 py-3 px-2 text-left">Total Product</th>
            <th className="border-b-4 py-3 px-2 text-left">Action</th>
          </tr>
          {categories?.map((category: any) => {
            return (
              <tr key={category.id} className="border-b-2 hover:bg-gray-100 duration-200">
                <td className="py-3 px-2">{category.name}</td>
                <td className="py-3 px-2">{category.fnbs.length}</td>
                <td className="py-3 px-2">
                  <div className='flex items-center gap-2'>
                    <a href={`/backoffices/categories/${category.id}/edit`}>
                      <img src={editIcon} alt="editIcon" width={20} />
                    </a>
                    {!category.fnbs.length ? (
                      <form
                        onSubmit={handleSubmit(() => {
                          axios
                            .delete(`${process.env.REACT_APP_API_BASE_URL}/categories/${category.id}`, {
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem('access-token')}`,
                              },
                            })
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
