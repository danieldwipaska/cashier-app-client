import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { MODIFIERS_QUERY_KEY } from 'configs/utils';

const Modifiers = () => {
  // START QUERIES
  const { data: modifiers } = useQuery({
    queryKey: MODIFIERS_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/modifiers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          if (err.status === 404) return [];
          return console.log(err);
        }),
  });

  // END QUERIES
  console.log(modifiers);

  return (
    <Layout>
      <Header title="MODIFIERS" />
      <section>
        <div className="mb-5">
          <a href={'/backoffices/modifiers/add'} className="bg-green-300 py-3 px-5 rounded-lg">
            Add
          </a>
        </div>
        <table className="w-full">
          <tr className="bg-green-300">
            <th className="border-b-4 py-3 px-2 text-left">Code</th>
            <th className="border-b-4 py-3 px-2 text-left">Name</th>
            <th className="border-b-4 py-3 px-2 text-left">Status</th>
          </tr>
          {modifiers?.map((modifier: any) => {
            return (
              <tr key={modifier.id} className="border-b-2 hover:bg-gray-100 duration-200">
                <td className="py-3 px-2">{modifier.code}</td>
                <td className="py-3 px-2">{modifier.name}</td>
                <td className="py-3 px-2">{modifier.is_active ? 'Active' : 'Inactive'}</td>
              </tr>
            );
          })}
        </table>
      </section>
    </Layout>
  );
};

export default Modifiers;
