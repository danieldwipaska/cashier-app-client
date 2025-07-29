import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CREWS_QUERY_KEY, ErrorMessage, ReportType } from 'configs/utils';
import deleteIcon from '../../../assets/img/icons/icon-delete.svg';
import editIcon from '../../../assets/img/icons/icon-edit.svg';
import { useForm } from 'react-hook-form';
import PaySummary from 'components/Backoffices/Crews/PaySummary';
import TopupSummary from 'components/Backoffices/Crews/TopupSummary';
import CheckoutSummary from 'components/Backoffices/Crews/CheckoutSummary';
import AdjustmentSummary from 'components/Backoffices/Crews/AdjustmentSummary';
import { useMessages } from 'context/MessageContext';

const Crews = () => {
  // START HOOKS
  // - delete
  const { register, handleSubmit } = useForm();
  const { showMessage } = useMessages();
  // END HOOKS

  // START QUERIES
  const { data: crews, refetch: crewsRefetch } = useQuery({
    queryKey: CREWS_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/crews`, {
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

  return (
    <Layout>
      <Header title="CREWS" />
      <section>
        <div className="mb-5">
          <a href={'/backoffices/crews/add'} className="bg-green-300 py-3 px-5 rounded-lg">
            Add
          </a>
        </div>
        <div className="flex gap-5">
          <div className="min-w-[500px]">
            <table className="w-full">
              <tr className="bg-green-200">
                <th className="border-b-4 py-3 px-2 text-left">Crew Name</th>
                <th className="border-b-4 py-3 px-2 text-left">Status</th>
                <th className="border-b-4 py-3 px-2 text-left">Position</th>
                <th className="border-b-4 py-3 px-2 text-left">Action</th>
              </tr>
              {crews?.map((crew: any) => {
                return (
                  <tr key={crew.id} className="border-b-2 hover:bg-gray-100 duration-200">
                    <td className="py-3 px-2">{crew.name}</td>
                    <td className="py-3 px-2">{crew.is_active ? 'active' : 'inactive'}</td>
                    <td className="py-3 px-2">{crew.position}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <a href={`/backoffices/crews/${crew.id}/edit`}>
                          <img src={editIcon} alt="editIcon" width={20} />
                        </a>
                        <form
                          onSubmit={handleSubmit(() => {
                            axios
                              .delete(`${process.env.REACT_APP_API_BASE_URL}/crews/${crew.id}`, {
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem('access-token')}`,
                                },
                              })
                              .then((res) => {
                                return crewsRefetch();
                              })
                              .catch((error) => {
                                if (error?.response?.data?.statusCode === 404) return showMessage(ErrorMessage.CREW_NOT_FOUND, 'error');
                                if (error?.response?.data?.statusCode === 500) return showMessage(ErrorMessage.INTERNAL_SERVER_ERROR, 'error');
                                if (error?.response?.data?.statusCode === 400) return showMessage(ErrorMessage.BAD_REQUEST, 'error');
                                if (error?.response?.data?.statusCode === 401) return showMessage(error.response?.data?.message, 'error');
                                return showMessage(ErrorMessage.UNEXPECTED_ERROR, 'error');
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
          </div>
          <div className="flex flex-col gap-3">
            <TopupSummary keys={[ReportType.TOPUP, ReportType.TOPUP_AND_ACTIVATE]} title="Daily Top-up" />
            <CheckoutSummary keys={[ReportType.CHECKOUT]} title="Daily Checkout" />
            <AdjustmentSummary keys={[ReportType.ADJUSTMENT]} title="Daily Adjustment" />
            <PaySummary keys={[ReportType.PAY]} title="Daily Payment" />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Crews;
