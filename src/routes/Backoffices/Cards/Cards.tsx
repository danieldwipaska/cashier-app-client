import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL, CARDS_METHOD_QUERY_KEY } from 'configs/utils';
import { useForm } from 'react-hook-form';
import deleteIcon from '../../../assets/img/icons/icon-delete.svg';
import editIcon from '../../../assets/img/icons/icon-edit.svg';

const Cards = () => {
  // START HOOKS
  const { register, handleSubmit } = useForm();
  // END HOOKS

  // START QUERIES
  const { data: cards, refetch: cardsRefetch } = useQuery({
    queryKey: CARDS_METHOD_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${API_BASE_URL}/cards`)
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          if (err.status === 404) return [];
          return console.log(err);
        }),
  });

  // END QUERIES

  return (
    <Layout>
      <Header title="CARDS" />
      <section>
      <div className="mb-5">
          <a href={'/backoffices/cards/add'} className="bg-green-400 py-3 px-5 rounded-lg">
            Add Card
          </a>
        </div>
        <table className="w-full">
          <tr className="">
            <th className="border-b-4 py-3 text-left">Number</th>
            <th className="border-b-4 py-3 text-left">Customer ID (phone)</th>
            <th className="border-b-4 py-3 text-left">Customer Name</th>
            <th className="border-b-4 py-3 text-left">Balance</th>
            <th className="border-b-4 py-3 text-left">Status</th>
            <th className="border-b-4 py-3 text-left">Member</th>
            <th className="border-b-4 py-3 text-left">Updated At</th>
            <th className="border-b-4 py-3 text-left">Actions</th>
          </tr>
          {cards?.map((card: any) => {
            return (
              <tr key={card.id} className="border-b-2">
                <td className="py-3">{card.card_number}</td>
                <td className="py-3">{card.customer_id}</td>
                <td className="py-3">{card.customer_name}</td>
                <td className="py-3">{card.balance}</td>
                <td className="py-3">{card.status}</td>
                <td className="py-3">{card.is_member ? 'yes' : 'no'}</td>
                <td className="py-3">{new Date(card.updated_at).toLocaleDateString('id-ID')}</td>
                <td className="py-3">
                <div className="flex items-center gap-2">
                    <a href={`/backoffices/payment-methods/${card.id}/edit`}>
                      <img src={editIcon} alt="editIcon" width={20} />
                    </a>
                    <form
                      onSubmit={handleSubmit(() => {
                        axios
                          .delete(`${API_BASE_URL}/methods/${card.id}`)
                          .then((res) => {
                            return cardsRefetch();
                          })
                          .catch((err) => {
                            return console.log(err);
                          });
                      })}
                      className="flex items-center"
                    >
                      <input type="hidden" {...register('id')} value={card.id} readOnly />
                      <button type="submit">
                        <img src={deleteIcon} alt="deleteIcon" width={20} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            );
          })}
        </table>
      </section>
    </Layout>
  );
};

export default Cards;
