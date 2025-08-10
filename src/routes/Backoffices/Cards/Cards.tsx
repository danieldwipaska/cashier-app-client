import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CARDS_METHOD_QUERY_KEY } from 'configs/utils';
import { useEffect, useState } from 'react';
import Pagination from 'components/Pagination';
import { Link } from 'react-router-dom';

const Cards = () => {
  // START STATES
  const [page, setPage] = useState(1);
  // END STATES

  // START QUERIES
  const { data: cards, refetch: cardsRefetch } = useQuery({
    queryKey: CARDS_METHOD_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/cards?page=${page}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
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
          <Link to='/backoffices/cards/add' className="bg-green-300 py-3 px-5 rounded-lg">
            Add
          </Link>
        </div>
        <table className="w-full">
          <tr className="bg-green-300">
            <th className="border-b-4 py-3 px-2 text-left">Number</th>
            <th className="border-b-4 py-3 px-2 text-left">Customer ID (phone)</th>
            <th className="border-b-4 py-3 px-2 text-left">Customer Name</th>
            <th className="border-b-4 py-3 px-2 text-left">Balance</th>
            <th className="border-b-4 py-3 px-2 text-left">Status</th>
            <th className="border-b-4 py-3 px-2 text-left">Member</th>
            <th className="border-b-4 py-3 px-2 text-left">Updated At</th>
          </tr>
          {cards?.data?.map((card: any) => {
            return (
              <tr key={card.id} className="border-b-2 hover:bg-gray-100 duration-200">
                <td className="py-3 px-2">{card.card_number}</td>
                <td className="py-3 px-2">{card.customer_id}</td>
                <td className="py-3 px-2">{card.customer_name}</td>
                <td className="py-3 px-2">{Intl.NumberFormat('id-ID').format(card.balance)}</td>
                <td className="py-3 px-2">{card.status}</td>
                <td className="py-3 px-2">{card.is_member ? 'yes' : 'no'}</td>
                <td className="py-3 px-2">{new Date(card.updated_at).toLocaleDateString('id-ID')}</td>
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
