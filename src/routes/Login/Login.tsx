import { Alert, Box, Button, TextField } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';

const Login = () => {
  const [credentialError, setCredentialError] = useState(false);

  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { handleSubmit, register } = useForm()

  const onSubmit = async (data: any) => {
    try {
      const res = await axios.post('http://localhost:3001/auth/login', { username: data.username, password: data.password });

      signIn(res.data.data.username);

      localStorage.setItem('username', res.data.data.username);
      localStorage.setItem('access-token', res.data.accessToken);
      navigate('/');
    } catch (error: any) {
      console.log(error.response.data);
      if (error.response.data.statusCode === 404 || error.response.data.statusCode === 401) {
        setCredentialError(true);
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 h-screen">
        <div className="place-self-center rounded-md border p-5">
          <div>
            <p className="text-2xl">Welcome!</p>
          </div>
          <div className="mt-4 mx-2">{credentialError ? <Alert severity="error">Wrong Credentials!</Alert> : null}</div>
          <div className="mt-2">
            <Box
              component="div"
              display="grid"
              sx={{
                '& > :not(style)': { m: 1, width: '40ch' },
              }}
            >
              <TextField id="filled-basic" label="Username" variant="filled" {...register('username')} />
              <TextField id="filled-basic" label="Password" variant="filled" type="password" {...register('password')} />
            </Box>
          </div>
          <div className="mt-16 ml-2 flex items-center">
            <div>
              <Box component="div" display="flex">
                <Button type='submit' variant="contained" color="success">
                  Login
                </Button>
              </Box>
            </div>

            <div className="flex">
              <p className="ml-2 text-black/40 text-sm">Don't have an account? </p>
              <button className="mx-2 text-green-600 text-sm" disabled>
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default Login;
