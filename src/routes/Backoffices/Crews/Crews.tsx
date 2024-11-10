import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL, CREWS_QUERY_KEY } from 'configs/utils';
import deleteIcon from '../../../assets/img/icons/icon-delete.svg';
import editIcon from '../../../assets/img/icons/icon-edit.svg';
import { useForm } from 'react-hook-form';

const Crews = () => {
  // START HOOKS
  // - delete
  const { register, handleSubmit } = useForm();
  // END HOOKS

  // START QUERIES
  const { data: crews, refetch: crewsRefetch } = useQuery({
    queryKey: CREWS_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${API_BASE_URL}/crews`)
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
      <Header title="crews" />
      <section>
        <div className="mb-5">
          <a href={'/backoffices/crews/add'} className="bg-green-400 py-3 px-5 rounded-lg">
            Add Crew
          </a>
        </div>
        <table className="w-2/4">
          <tr className="">
            <th className="border-b-4 py-3 text-left">Crew Name</th>
            <th className="border-b-4 py-3 text-left">Position</th>
            <th className="border-b-4 py-3 text-left">Action</th>
          </tr>
          {crews?.map((crew: any) => {
            return (
              <tr key={crew.id} className="border-b-2">
                <td className="py-3">{crew.name}</td>
                <td className="py-3">{crew.position}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <a href={`/backoffices/crews/${crew.id}/edit`}>
                      <img src={editIcon} alt="editIcon" width={20} />
                    </a>
                    <form
                      onSubmit={handleSubmit(() => {
                        axios
                          .delete(`${API_BASE_URL}/crews/${crew.id}`)
                          .then((res) => {
                            return crewsRefetch();
                          })
                          .catch((err) => {
                            return console.log(err);
                          });
                      })}
                      className="flex items-center"
                    >
                      <input type="hidden" {...register('id')} value={crew.id} readOnly />
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

export default Crews;
