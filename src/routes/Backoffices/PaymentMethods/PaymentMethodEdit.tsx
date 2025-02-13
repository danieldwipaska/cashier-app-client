import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { PAYMENT_METHOD_QUERY_KEY } from 'configs/utils';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useForm } from 'react-hook-form';

const PaymentMethodEdit = () => {
  // START HOOKS
  const navigate = useNavigate();
  const { paymentMethodId } = useParams();
  const { register, handleSubmit } = useForm();
  // START HOOKS

  // START STATES
  const [name, setName] = useState('');
  // END STATES

  // START CHANGE
  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };
  // END CHANGE

  // START QUERIES
  useQuery({
    queryKey: PAYMENT_METHOD_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/methods/${paymentMethodId}`)
        .then((res) => {
          setName(res.data.data.name);

          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  // END QUERIES

  const onSubmit = (data: any) => {
    axios
      .patch(`${process.env.REACT_APP_API_BASE_URL}/methods/${paymentMethodId}`, data)
      .then((res) => {
        return navigate('/backoffices/payment-methods', { replace: true });
      })
      .catch((err) => {
        return console.log(err);
      });
  };

  return (
    <Layout>
      <Header title="EDIT CREW" />
      <section>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 max-w-[300px] items-center">
              <label className="" htmlFor="name">
                Name
              </label>
              <input {...register('name')} type="text" className="border px-3 py-2 rounded-lg" id="name" placeholder="ex. Appetizer" value={name} onChange={handleNameChange} required />
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

export default PaymentMethodEdit;
