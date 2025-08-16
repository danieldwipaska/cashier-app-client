import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CREW_QUERY_KEY, ErrorMessage } from 'configs/utils';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useForm } from 'react-hook-form';
import { useMessages } from 'context/MessageContext';
import { CircularProgress } from '@mui/material';

const CrewEdit = () => {
  // START HOOKS
  const navigate = useNavigate();
  const { crewId } = useParams();
  const { handleSubmit } = useForm();
  const { showMessage } = useMessages();
  // START HOOKS

  // START STATES
  const [name, setName] = useState('');
  const [activeStatus, setActiveStatus] = useState(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  // END STATES

  // START CHANGE
  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };

  const handleActiveStatusChange = (event: any) => {
    setActiveStatus(event.target.checked);
  };
  // END CHANGE

  // START QUERIES
  useQuery({
    queryKey: CREW_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/crews/${crewId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
        .then((res) => {
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
    setSubmitLoading(true);
    axios
      .patch(
        `${process.env.REACT_APP_API_BASE_URL}/crews/${crewId}`,
        {
          name: name,
          is_active: activeStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        }
      )
      .then((res) => {
        showMessage('Crew updated successfully', 'success');
        return navigate('/backoffices/crews', { replace: true });
      })
      .catch((error) => {
        if (error?.response?.data?.statusCode === 404) return showMessage(ErrorMessage.CREW_NOT_FOUND, 'error');
        if (error?.response?.data?.statusCode === 500) return showMessage(ErrorMessage.INTERNAL_SERVER_ERROR, 'error');
        if (error?.response?.data?.statusCode === 400) return showMessage(ErrorMessage.BAD_REQUEST, 'error');
        if (error?.response?.data?.statusCode === 401) return showMessage(error.response?.data?.message, 'error');
        return showMessage(ErrorMessage.UNEXPECTED_ERROR, 'error');
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  return (
    <Layout>
      <Header title="EDIT CREW" />
      <section>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3">
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
              <button type="submit" className="bg-green-300 py-2 px-3 rounded-lg" disabled={submitLoading}>
                {submitLoading ? (
                  <div className="flex items-center gap-2">
                    <p>Loading</p>
                    <CircularProgress color="warning" size={15} />
                  </div>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default CrewEdit;
