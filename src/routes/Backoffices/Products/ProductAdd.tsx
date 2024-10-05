import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import style from '../../../assets/css/style.module.css';
import { useForm } from 'react-hook-form';
import { API_BASE_URL, CATEGORIES_QUERY_KEY } from 'lib/utils';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const ProductAdd = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

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

  const onSubmit = (data: any) => {
    axios
      .post(`${API_BASE_URL}/fnbs`, {
        ...data,
        price: Number(data.price)
      })
      .then((res) => {
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
          <div className={style.productCreation}>
            <div className={style.formInput}>
              <label className={style.inputLabel} htmlFor="name">
                Name
              </label>
              <input type="text" className={style.input} id="name" {...register('name')} placeholder='ex. Nasi Goreng' required />
            </div>
            <div className={style.formInput}>
              <label className={style.inputLabel} htmlFor="price">
                Price
              </label>
              <input type="number" className={style.input} id="price" {...register('price')} placeholder='ex. 25000' required />
            </div>
            <div className={style.formInput}>
              <label className={style.inputLabel} htmlFor="categoryId">
                Category
              </label>
              <select {...register('categoryId')} id="categoryId" className={style.input} required>
                <option value="">----</option>
                {categories?.map((category: any) => {
                  return <option key={category.id} value={category.id}>{category.name}</option>;
                })}
              </select>
            </div>
            <br />
            <br />
            <button type="submit" className={style.submitButton}>
              Submit
            </button>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default ProductAdd;
