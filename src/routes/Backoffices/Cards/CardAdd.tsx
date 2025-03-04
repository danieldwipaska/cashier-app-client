import axios from 'axios';
import { CARD_TYPES } from 'configs/utils';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import INewCardData from 'interfaces/CardData';

const CardAdd = () => {
  const { register, handleSubmit } = useForm<NewCardFormData>();
  const navigate = useNavigate();

  const onSubmit = (data: NewCardFormData) => {
    const payload: INewCardData = {
      card_number: data.card_number,
      is_member: false,
    }

    if (data.type === 'Member') payload.is_member = true;

    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/cards`, payload)
      .then((res) => {
        return navigate('/backoffices/cards', { replace: true });
      })
      .catch((err) => {
        return console.log(err);
      });
  };

  // Interfaces
  interface NewCardFormData extends INewCardData {
    type: string;
  }

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
              <select {...register('is_member')} id="is_member" className="border px-3 py-2 rounded-lg" required>
                <option value="">----</option>
                {CARD_TYPES?.map((type: any) => {
                  return <option value={type}>{type}</option>;
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

export default CardAdd;
