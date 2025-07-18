import { BACKOFFICE_SETTINGS_QUERY_KEY, CATEGORIES_QUERY_KEY, ErrorMessage } from 'configs/utils';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useMessages } from 'context/MessageContext';
import { useState, useEffect } from 'react';

const Settings = () => {
  const { handleSubmit, register } = useForm();
  const { showMessage } = useMessages();
  const [categories, setCategories] = useState<any>([]);

  // START QUERIES
  const { data: backofficeSetting } = useQuery({
    queryKey: BACKOFFICE_SETTINGS_QUERY_KEY,
    queryFn: () => {
      return axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/backoffice-settings`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          if (err.status === 404) return [];
          return console.log(err);
        });
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () => {
      return axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/categories`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
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

  // Effect to set categories when data is loaded
  useEffect(() => {
    if (categoriesData && backofficeSetting) {
      const categoryData = categoriesData.map((category: any) => {
        const isChecked = backofficeSetting?.CrewPurchaseCategory?.find((categoryObj: any) => {
          return categoryObj.category.id === category.id;
        });

        return {
          category_id: category.id,
          category_name: category.name,
          checked: !!isChecked,
        };
      });
      setCategories(categoryData);
    } else if (categoriesData && !backofficeSetting) {
      // If no backoffice settings exist yet, set all categories as unchecked
      const categoryData = categoriesData.map((category: any) => {
        return {
          category_id: category.id,
          category_name: category.name,
          checked: false,
        };
      });
      setCategories(categoryData);
    }
  }, [categoriesData, backofficeSetting]);

  // START FUNCTIONS
  const updateCategory = (id: any, checked: any) => {
    const updatedCategories = categories?.map((category: any) => {
      if (category.category_id === id) {
        return {
          ...category,
          checked,
        };
      } else {
        return category;
      }
    });

    if (updatedCategories.length) setCategories(updatedCategories);
  };

  const onSubmit = async (_: any) => {
    const payload = {
      crewPurchaseCategories: categories
        .filter((category: any) => category.checked)
        .map((category: any) => {
          return {
            category_id: category.category_id,
          };
        }),
    };

    try {
      await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/backoffice-settings`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      });

      showMessage('Backoffice Setting has been updated', 'success');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error?.response?.data?.statusCode === 404) return showMessage(ErrorMessage.SETTING_NOT_FOUND, 'error');
        if (error?.response?.data?.statusCode === 500) return showMessage(ErrorMessage.INTERNAL_SERVER_ERROR, 'error');
        if (error?.response?.data?.statusCode === 400) return showMessage(ErrorMessage.BAD_REQUEST, 'error');
        if (error?.response?.data?.statusCode === 401) return showMessage(error.response?.data?.message, 'error');
        return showMessage(ErrorMessage.UNEXPECTED_ERROR, 'error');
      } else {
        showMessage(ErrorMessage.UNEXPECTED_ERROR, 'error');
      }
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
                  <label key={category.category_id} htmlFor={`category-${index}`} className="flex gap-1 flex-1 min-w-32">
                    <input
                      type="checkbox"
                      id={`category-${index}`}
                      {...register('categories')}
                      value={category.category_name}
                      onChange={(event) => {
                        updateCategory(category.category_id, event.target.checked);
                      }}
                      checked={category.checked}
                    />
                    {category.category_name}
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
