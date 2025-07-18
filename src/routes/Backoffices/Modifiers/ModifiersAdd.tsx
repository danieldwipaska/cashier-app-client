import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useMessages } from 'context/MessageContext';
import { ErrorMessage } from 'configs/utils';

const ModifierAdd = () => {
  const { showMessage } = useMessages();

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/modifiers`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      })
      .then((res) => {
        showMessage('Modifier added successfully', 'success');
        return navigate('/backoffices/modifiers', { replace: true });
      })
      .catch((error) => {
        if (error?.response?.data?.statusCode === 404) return showMessage(ErrorMessage.MODIFIER_NOT_FOUND, 'error');
        if (error?.response?.data?.statusCode === 500) return showMessage(ErrorMessage.INTERNAL_SERVER_ERROR, 'error');
        if (error?.response?.data?.statusCode === 400) return showMessage(ErrorMessage.BAD_REQUEST, 'error');
        if (error?.response?.data?.statusCode === 401) return showMessage(ErrorMessage.INVALID_CREW_CODE, 'error');
        return showMessage(ErrorMessage.UNEXPECTED_ERROR, 'error');
      });
  };

  return (
    <Layout>
      <Header title="ADD MODIFIER" />
      <section>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 max-w-[300px] items-center">
              <label className="" htmlFor="code">
                Code
              </label>
              <input type="text" className="border px-3 py-2 rounded-lg" id="code" {...register('code')} placeholder="ex. MOD001" required />
            </div>
            <div className="grid grid-cols-2 max-w-[300px] items-center">
              <label className="" htmlFor="name">
                Name
              </label>
              <input type="text" className="border px-3 py-2 rounded-lg" id="name" {...register('name')} placeholder="ex. Hot" required />
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

export default ModifierAdd;
