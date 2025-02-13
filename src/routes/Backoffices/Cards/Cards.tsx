import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CARDS_METHOD_QUERY_KEY } from 'configs/utils';
import { useEffect, useState } from 'react';
import Pagination from 'components/Pagination';

const Cards = () => {
  // START STATES
  const [page, setPage] = useState(1);
  // END STATES

  // START QUERIES
  const { data: cards, refetch: cardsRefetch } = useQuery({
    queryKey: CARDS_METHOD_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/cards?page=${page}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          if (err.status === 404) return [];
          return console.log(err);
        }),
  });

  // END QUERIES

  useEffect(() => {
    cardsRefetch();
    window.scrollTo(0, 0);
  }, [page, cardsRefetch]);

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
          </tr>
          {cards?.data?.map((card: any) => {
            return (
              <tr key={card.id} className="border-b-2">
                <td className="py-3">{card.card_number}</td>
                <td className="py-3">{card.customer_id}</td>
                <td className="py-3">{card.customer_name}</td>
                <td className="py-3">{card.balance}</td>
                <td className="py-3">{card.status}</td>
                <td className="py-3">{card.is_member ? 'yes' : 'no'}</td>
                <td className="py-3">{new Date(card.updated_at).toLocaleDateString('id-ID')}</td>
              </tr>
            );
          })}
        </table>
        <Pagination setPage={setPage} pageMetaData={cards?.pageMetaData} />
      </section>
    </Layout>
  );
};

export default Cards;
