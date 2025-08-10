import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useMessages } from 'context/MessageContext';
import { ErrorMessage } from 'configs/utils';

const CategoryAdd = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { showMessage } = useMessages();

  const onSubmit = (data: any) => {
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/categories`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        }
      })
      .then((res) => {
        showMessage('Category added successfully', 'success');
        return navigate('/backoffices/categories', { replace: true });
      })
      .catch((error) => {
          if (error?.response?.data?.statusCode === 404) return showMessage(ErrorMessage.CATEGORY_NOT_FOUND, 'error');
          if (error?.response?.data?.statusCode === 500) return showMessage(ErrorMessage.INTERNAL_SERVER_ERROR, 'error');
          if (error?.response?.data?.statusCode === 400) return showMessage(ErrorMessage.BAD_REQUEST, 'error');
          if (error?.response?.data?.statusCode === 401) return showMessage(ErrorMessage.INVALID_CREW_CODE, 'error');
          return showMessage(ErrorMessage.UNEXPECTED_ERROR, 'error');
      });
  };

  return (
    <Layout>
      <Header title="ADD CATEGORIES" />
      <section>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="">
            <div className="grid grid-cols-2 max-w-[300px] items-center">
              <label className="" htmlFor="name">
                Name
              </label>
              <input type="text" className="border px-3 py-2 rounded-lg" id="name" {...register('name')} placeholder="ex. Appetizer" required />
            </div>
            <br />
            <br />
            <button type="submit" className="bg-green-300 py-2 px-3 rounded-lg">
              Submit
            </button>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default CategoryAdd;
