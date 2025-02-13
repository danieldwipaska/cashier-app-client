import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CREW_QUERY_KEY, POSITIONS } from 'configs/utils';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useForm } from 'react-hook-form';

const CrewEdit = () => {
  // START HOOKS
  const navigate = useNavigate();
  const { crewId } = useParams();
  const { register, handleSubmit } = useForm();
  // START HOOKS

  // START STATES
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [code, setCode] = useState('');
  // END STATES

  // START CHANGE
  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };

  const handlePositionChange = (event: any) => {
    setPosition(event.target.value);
  };

  const handleCodeChange = (event: any) => {
    setCode(event.target.value);
  };
  // END CHANGE

  // START QUERIES
  useQuery({
    queryKey: CREW_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/crews/${crewId}`)
        .then((res) => {
          setName(res.data.data.name);
          setPosition(res.data.data.position);
          setCode(res.data.data.code);

          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  // END QUERIES

  const onSubmit = (data: any) => {
    axios
      .patch(`${process.env.REACT_APP_API_BASE_URL}/crews/${crewId}`, data)
      .then((res) => {
        return navigate('/backoffices/crews', { replace: true });
      })
      .catch((err) => {
        return console.log(err);
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
              <input {...register('name')} type="text" className="border px-3 py-2 rounded-lg" id="name" placeholder="ex. Appetizer" value={name} onChange={handleNameChange} required />
            </div>
            <div className="grid grid-cols-2 max-w-[300px] items-center">
              <label className="" htmlFor="position">
                Position
              </label>
              <select {...register('position')} id="position" className="border px-3 py-2 rounded-lg" value={position} onChange={handlePositionChange} required>
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
              <input {...register('code')} type="text" className="border px-3 py-2 rounded-lg" id="code" placeholder="ex. 123456" value={code} onChange={handleCodeChange} required />
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

export default CrewEdit;
