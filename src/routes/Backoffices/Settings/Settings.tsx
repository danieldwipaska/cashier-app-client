import { BACKOFFICE_SETTINGS_QUERY_KEY, CATEGORIES_QUERY_KEY } from 'configs/utils';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useMessages } from 'context/MessageContext';

const Settings = () => {
  const { handleSubmit, register } = useForm();
  const { showMessage } = useMessages();

  // START QUERIES
  const { data: backofficeSetting, refetch: backofficeSettingRefetch } = useQuery({
    queryKey: BACKOFFICE_SETTINGS_QUERY_KEY,
    queryFn: () => {
      return axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/backoffice-settings`)
        .then((res) => {
          return res.data.data[0];
        })
        .catch((err) => {
          if (err.status === 404) return [];
          return console.log(err);
        });
    },
  });

  const { data: categories, refetch: categoriesRefetch } = useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () => {
      return axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/categories`)
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          if (err.status === 404) return [];
          return console.log(err);
        });
    },
  });

  // END QUERIES

  // START FUNCTIONS
  const onSubmit = async (data: any) => {
    const payload = {
      categoryIds: data.categories,
    };

    try {
      await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/backoffice-settings/${backofficeSetting?.id}`, payload);

      showMessage('Backoffice Setting has been updated', 'success');
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  // END FUNCTIONS

  return (
    <Layout>
      <Header title="SETTINGS" />
      <section>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3 className="text-xl font-semibold mb-2">Dashboard</h3>
          <div className="grid grid-cols-[300px_minmax(0,_1fr)] items-center gap-5">
            <div className="">Crew Purchases by Categories</div>
            <div className="flex flex-wrap gap-5">
              {categories?.map((category: any, index: number) => {
                return (
                  <label key={category.id} htmlFor={`category-${index}`} className="flex gap-1 flex-1 min-w-32">
                    <input
                      type="checkbox"
                      id={`category-${index}`}
                      {...register('categories')}
                      value={category.id}
                      defaultChecked={
                        backofficeSetting?.purchase_categories.find((categoryObj: any) => {
                          return categoryObj.id === category.id;
                        })
                          ? true
                          : false
                      }
                    />
                    {category.name}
                  </label>
                );
              })}
            </div>
          </div>
          <button className="py-2 px-3 bg-green-300 rounded-md mt-10">Update</button>
        </form>
      </section>
    </Layout>
  );
};

export default Settings;
