import axios from 'axios';
import { ErrorMessage, POSITIONS } from 'configs/utils';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useMessages } from 'context/MessageContext';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';

const CrewsAdd = () => {
  // START STATES
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  // END STATES

  // START HOOKS
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { showMessage } = useMessages();
  // END HOOKS

  // START FUNCTIONS
  const onSubmit = (data: any) => {
    setSubmitLoading(true);
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/crews`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      })
      .then((res) => {
        showMessage('Crew added successfully', 'success');
        return navigate('/backoffices/crews', { replace: true });
      })
      .catch((error) => {
        if (error?.response?.data?.statusCode === 404) return showMessage(ErrorMessage.CREW_NOT_FOUND, 'error');
        if (error?.response?.data?.statusCode === 500) return showMessage(ErrorMessage.INTERNAL_SERVER_ERROR, 'error');
        if (error?.response?.data?.statusCode === 400) return showMessage(ErrorMessage.BAD_REQUEST, 'error');
        if (error?.response?.data?.statusCode === 401) return showMessage(ErrorMessage.INVALID_CREW_CODE, 'error');
        return showMessage(ErrorMessage.UNEXPECTED_ERROR, 'error');
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };
  // END FUNCTIONS

  return (
    <Layout>
      <Header title="ADD CREW" />
      <section>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 max-w-[300px] items-center">
              <label className="" htmlFor="name">
                Name
              </label>
              <input type="text" className="border px-3 py-2 rounded-lg" id="name" {...register('name')} placeholder="ex. Agil" required />
            </div>
            <div className="grid grid-cols-2 max-w-[300px] items-center">
              <label className="" htmlFor="position">
                Position
              </label>
              <select {...register('position')} id="position" className="border px-3 py-2 rounded-lg" required>
                <option value="">----</option>
                {POSITIONS?.map((position: any) => {
                  return <option value={position}>{position}</option>;
                })}
              </select>
            </div>
            <div className="grid grid-cols-2 max-w-[300px] items-center">
              <label className="" htmlFor="code">
                Code
              </label>
              <input type="text" className="border px-3 py-2 rounded-lg" id="code" {...register('code')} placeholder="ex. 123456" required />
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

export default CrewsAdd;
