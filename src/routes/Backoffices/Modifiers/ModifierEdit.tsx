import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorMessage, PAYMENT_METHOD_QUERY_KEY } from 'configs/utils';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useForm } from 'react-hook-form';
import { useMessages } from 'context/MessageContext';

const ModifierEdit = () => {
  // START HOOKS
  const navigate = useNavigate();
  const { modifierId } = useParams();
  const { handleSubmit } = useForm();
  const { showMessage } = useMessages();
  // START HOOKS

  // START STATES
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [activeStatus, setActiveStatus] = useState(false);
  // END STATES

  // START CHANGE
  const handleCodeChange = (event: any) => {
    setCode(event.target.value);
  };
  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };
  const handleActiveStatusChange = (event: any) => {
    setActiveStatus(event.target.checked);
  };
  // END CHANGE

  // START QUERIES
  useQuery({
    queryKey: PAYMENT_METHOD_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/modifiers/${modifierId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
        .then((res) => {
          setCode(res.data.data.code);
          setName(res.data.data.name);
          setActiveStatus(res.data.data.is_active);

          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  // END QUERIES

  const onSubmit = (data: any) => {
    axios
      .patch(
        `${process.env.REACT_APP_API_BASE_URL}/modifiers/${modifierId}`,
        {
          code,
          name,
          is_active: activeStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        }
      )
      .then((res) => {
        showMessage('Modifier updated successfully', 'success');
        return navigate('/backoffices/modifiers', { replace: true });
      })
      .catch((error) => {
        if (error?.response?.data?.statusCode === 404) return showMessage(ErrorMessage.MODIFIER_NOT_FOUND, 'error');
        if (error?.response?.data?.statusCode === 500) return showMessage(ErrorMessage.INTERNAL_SERVER_ERROR, 'error');
        if (error?.response?.data?.statusCode === 400) return showMessage(ErrorMessage.BAD_REQUEST, 'error');
        if (error?.response?.data?.statusCode === 401) return showMessage(error.response?.data?.message, 'error');
        return showMessage(ErrorMessage.UNEXPECTED_ERROR, 'error');
      });
  };

  return (
    <Layout>
      <Header title="EDIT CREW" />
      <section>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 max-w-[300px] items-center">
              <label className="" htmlFor="code">
                Code
              </label>
              <input type="text" className="border px-3 py-2 rounded-lg" id="code" placeholder="ex. Appetizer" value={code} onChange={handleCodeChange} required />
            </div>
            <div className="grid grid-cols-2 max-w-[300px] items-center">
              <label className="" htmlFor="name">
                Name
              </label>
              <input type="text" className="border px-3 py-2 rounded-lg" id="name" placeholder="ex. Appetizer" value={name} onChange={handleNameChange} required />
            </div>
            <div className="grid grid-cols-2 max-w-[300px] py-3 items-center justify-items-start">
              <label className="" htmlFor="activeStatus">
                Active
              </label>
              <input type="checkbox" className=" w-6 h-6" id="activeStatus" checked={activeStatus} onChange={handleActiveStatusChange} />
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

export default ModifierEdit;
