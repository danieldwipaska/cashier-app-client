import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorMessage, PAYMENT_METHODS_QUERY_KEY } from 'configs/utils';
import deleteIcon from '../../../assets/img/icons/icon-delete.svg';
import editIcon from '../../../assets/img/icons/icon-edit.svg';
import { useForm } from 'react-hook-form';
import { useMessages } from 'context/MessageContext';
import { Link } from 'react-router-dom';

const PaymentMethods = () => {
  // START HOOKS
  const { register, handleSubmit } = useForm();
  const { showMessage } = useMessages();
  // END HOOKS

  // START QUERIES
  const { data: paymentMethods, refetch: paymentMethodsRefetch } = useQuery({
    queryKey: PAYMENT_METHODS_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/methods`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
        .then((res) => {
          return res.data.data;
        })
        .catch((err): any => {
          if (err.status === 404) return [];
          return console.log(err);
        }),
  });

  // END QUERIES

  return (
    <Layout>
      <Header title="PAYMENT METHODS" />
      <section>
        <div className="mb-5">
          <Link to={`/backoffices/payment-methods/add`} className="bg-green-300 py-3 px-5 rounded-lg">
            Add
          </Link>
        </div>
        <table className="w-2/4">
          <tr className="bg-green-200">
            <th className="border-b-4 py-3 px-2 text-left">Method Name</th>
            <th className="border-b-4 py-3 px-2 text-left">Status</th>
            <th className="border-b-4 py-3 px-2 text-left">Action</th>
          </tr>
          {paymentMethods?.map((method: any) => {
            return (
              <tr key={method.id} className="border-b-2 hover:bg-gray-100 duration-200">
                <td className="py-3 px-2">{method.name}</td>
                <td className="py-3 px-2">{method.is_active ? 'active' : 'inactive'}</td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <Link to={`/backoffices/payment-methods/${method.id}/edit`}>
                      <img src={editIcon} alt="editIcon" width={20} />
                    </Link>
                    <form
                      onSubmit={handleSubmit(() => {
                        axios
                          .delete(`${process.env.REACT_APP_API_BASE_URL}/methods/${method.id}`, {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem('access-token')}`,
                            },
                          })
                          .then((res) => {
                            return paymentMethodsRefetch();
                          })
                          .catch((error) => {
                            if (error?.response?.data?.statusCode === 404) return showMessage(ErrorMessage.PAYMENT_METHOD_NOT_FOUND, 'error');
                            if (error?.response?.data?.statusCode === 500) return showMessage(ErrorMessage.INTERNAL_SERVER_ERROR, 'error');
                            if (error?.response?.data?.statusCode === 400) return showMessage(ErrorMessage.BAD_REQUEST, 'error');
                            if (error?.response?.data?.statusCode === 401) return showMessage(error.response?.data?.message, 'error');
                            return showMessage(ErrorMessage.UNEXPECTED_ERROR, 'error');
                          });
                      })}
                      className="flex items-center"
                    >
                      <input type="hidden" {...register('id')} value={method.id} readOnly />
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

export default PaymentMethods;
