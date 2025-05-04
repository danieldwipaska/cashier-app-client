import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useForm } from 'react-hook-form';
import { CATEGORIES_QUERY_KEY } from 'configs/utils';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useMessages } from 'context/MessageContext';

const ProductAdd = () => {
  const { showMessage } = useMessages();

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  // START QUERIES
  const { data: categories } = useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/categories`)
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  // END QUERIES

  const onSubmit = (data: any) => {
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/fnbs`, {
        ...data,
        price: Number(data.price),
      })
      .then((res) => {
        showMessage('Product added successfully', 'success');
        return navigate('/backoffices/products', { replace: true });
      })
      .catch((err) => {
        return console.log(err);
      });
  };

  return (
    <Layout>
      <Header title="ADD PRODUCT" />
      <section>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 max-w-[300px] items-center">
              <label className="" htmlFor="name">
                Name
              </label>
              <input type="text" className="border px-3 py-2 rounded-lg" id="name" {...register('name')} placeholder="ex. Nasi Goreng" required />
            </div>
            <div className="grid grid-cols-2 max-w-[300px] items-center">
              <label className="" htmlFor="price">
                Price
              </label>
              <input type="number" className="border px-3 py-2 rounded-lg" id="price" {...register('price')} placeholder="ex. 25000" required />
            </div>
            <div className="grid grid-cols-2 max-w-[300px] items-center">
              <label className="" htmlFor="categoryId">
                Category
              </label>
              <select {...register('category_id')} id="categoryId" className="border px-3 py-2 rounded-lg" required>
                <option value="">----</option>
                {categories?.map((category: any) => {
                  return (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <br />
            <br />
            <div>
              <button type="submit" className="bg-green-300 py-2 px-3 rounded-lg">
                Submit
              </button>
            </div>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default ProductAdd;
