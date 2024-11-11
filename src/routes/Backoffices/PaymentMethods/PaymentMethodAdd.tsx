import axios from 'axios';
import { API_BASE_URL, POSITIONS } from 'configs/utils';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';

const PaymentMethodAdd = () => {
  // START HOOKS
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  // END HOOKS

  // START FUNCTIONS
  const onSubmit = (data: any) => {
    axios
      .post(`${API_BASE_URL}/methods`, data)
      .then((res) => {
        return navigate('/backoffices/payment-methods', { replace: true });
      })
      .catch((err) => {
        return console.log(err);
      });
  };
  // END FUNCTIONS

  return (
    <Layout>
      <Header title="ADD PAYMENT METHOD" />
      <section>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 max-w-[300px] items-center">
              <label className="" htmlFor="name">
                Name
              </label>
              <input type="text" className="border px-3 py-2 rounded-lg" id="name" {...register('name')} placeholder="ex. EDC BCA" required />
            </div>
            <br />
            <br />
            <div>
              <button type="submit" className="bg-green-500 py-2 px-3 rounded-lg">
                Submit
              </button>
            </div>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default PaymentMethodAdd;