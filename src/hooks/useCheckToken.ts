import { IUser } from '../context/AuthContext';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useCheckToken = (user: IUser) => {
  const navigate = useNavigate();

  return useEffect(() => {
    if (!user.username) return navigate('/login');

    axios
      .get('http://localhost:3001/auth/verify', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      })
      .then((res) => {
        return;
      })
      .catch((err) => {
        localStorage.removeItem('username');
        localStorage.removeItem('access-token');
        return navigate('/login');
      });
  });
};
