import axios from 'axios';
import { API_BASE_URL, POSITIONS } from 'configs/utils';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';

const CrewsAdd = () => {
  // START HOOKS
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  // END HOOKS

  // START FUNCTIONS
  const onSubmit = (data: any) => {
    axios
      .post(`${API_BASE_URL}/crews`, data)
      .then((res) => {
        return navigate('/backoffices/crews', { replace: true });
      })
      .catch((err) => {
        return console.log(err);
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
              <button type="submit" className="bg-green-500 py-2 px-3 rounded-lg">
                Submit
              </button>
            </div>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default CrewsAdd;
