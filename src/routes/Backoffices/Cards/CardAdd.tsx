import axios from 'axios';
import { API_BASE_URL, CARD_TYPES } from 'configs/utils';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';

const CardAdd = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    if (data.type === 'Member') data.is_member = true;
    if (data.type === 'Basic') data.is_member = false;

    delete data.type;

    axios
      .post(`${API_BASE_URL}/cards`, data)
      .then((res) => {
        return navigate('/backoffices/cards', { replace: true });
      })
      .catch((err) => {
        return console.log(err);
      });
  };

  return (
    <Layout>
      <Header title="ADD CARD" />
      <section>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 max-w-[300px] items-center">
              <label className="" htmlFor="cardNumber">
                Card Number
              </label>
              <input type="text" className="border px-3 py-2 rounded-lg" id="cardNumber" {...register('card_number')} placeholder="ex. 0007462836" required />
            </div>
            <div className="grid grid-cols-2 max-w-[300px] items-center">
              <label className="" htmlFor="type">
                Type
              </label>
              <select {...register('type')} id="type" className="border px-3 py-2 rounded-lg" required>
                <option value="">----</option>
                {CARD_TYPES?.map((type: any) => {
                  return <option value={type}>{type}</option>;
                })}
              </select>
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

export default CardAdd;
