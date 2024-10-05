import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL, SINGLE_CREW_QUERY_KEY, Role } from 'lib/utils';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import style from '../../../assets/css/style.module.css';

const CrewEdit = () => {
  // START HOOKS
  const navigate = useNavigate();
  const { crewId } = useParams();
  // START HOOKS

  // START HOOKS
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [code, setCode] = useState('');
  // END HOOKS

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
  const { data: crew } = useQuery({
    queryKey: SINGLE_CREW_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${API_BASE_URL}/crews/${crewId}`)
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

  const onSubmit = () => {
    axios
      .patch(`${API_BASE_URL}/crews/${crewId}`, {
        name,
        position,
        code,
      })
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
        <div className={style.productCreation}>
          <div className={style.formInput}>
            <label className={style.inputLabel} htmlFor="name">
              Name
            </label>
            <input type="text" className={style.input} id="name" placeholder="ex. Bambang" value={name} onChange={handleNameChange} required />
          </div>
          <div className={style.formInput}>
            <label className={style.inputLabel} htmlFor="position">
              Position
            </label>
            <select className={style.input} id="position" value={position} onChange={handlePositionChange} required>
              <option value={Role.SERVER}>Server</option>
              <option value={Role.BARTENDER}>Bartender</option>
              <option value={Role.ADMIN}>Admin</option>
            </select>
          </div>
          <div className={style.formInput}>
            <label className={style.inputLabel} htmlFor="code">
              Code
            </label>
            <input type="text" className={style.input} id="code" placeholder="number only" value={code} onChange={handleCodeChange} required />
          </div>
          <br />
          <br />
          <button className={style.submitButton} onClick={onSubmit}>
            Submit
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default CrewEdit;
