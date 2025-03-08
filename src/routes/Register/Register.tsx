import { Alert, Box, Button, TextField } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  //   const [isConfirmed, setIsConfirmed] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerStatus, setRegisterStatus] = useState('');

  const navigate = useNavigate();

  const handleUsernameChange = (event: any) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event: any) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/signup`, { username, password });

      setRegisterStatus('success');
    } catch (error: any) {
      console.log(error.response.data);
      if (error.response.data.statusCode === 404 || error.response.data.statusCode === 401 || error.response.data.statusCode === 400) {
        setRegisterStatus('error');
      }
    }
  };

  return (
    <div className="">
      <div className="grid grid-cols-1 h-screen">
        <div className="place-self-center rounded-md border p-5">
          <div>
            <p className="text-2xl">Register</p>
          </div>
          <div className="mt-4 mx-2">
            {registerStatus === 'error' ? <Alert severity="error">Username Not Available</Alert> : null}
            {registerStatus === 'success' ? (
              <Alert severity="success">
                Register done! Back to
                <button className="ml-1" onClick={() => navigate('/login')}>
                  Login
                </button>
              </Alert>
            ) : null}
          </div>
          <div className="mt-2">
            <Box
              component="form"
              display="grid"
              sx={{
                '& > :not(style)': { m: 1, width: '40ch' },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField id="filled-basic" label="Username" variant="filled" size="small" onChange={handleUsernameChange} value={username} />
              <TextField id="filled-basic" label="Password" variant="filled" size="small" type="password" onChange={handlePasswordChange} value={password} />
              {password?.includes(confirmPassword) ? (
                <TextField id="filled-basic" label="Confirm Password" variant="filled" size="small" type="password" onChange={handleConfirmPasswordChange} value={confirmPassword} />
              ) : (
                <TextField
                  id="filled-error"
                  label="Confirm Password"
                  variant="filled"
                  size="small"
                  type="password"
                  onChange={handleConfirmPasswordChange}
                  value={confirmPassword}
                  helperText="it must be exactly the same as the password"
                  error
                />
              )}
            </Box>
          </div>
          <div className="mt-16 ml-2 flex items-center">
            <div>
              <Box component="div" display="flex">
                <Button variant="contained" color="success" onClick={handleSubmit}>
                  Submit
                </Button>
              </Box>
            </div>
            <div className="flex">
              <p className="ml-2 text-black/40 text-sm">Back to</p>
              <button className="ml-1 text-green-600 text-sm" onClick={() => navigate('/login')}>
                Login
              </button>
              <p className="text-black/40 text-sm">, instead?</p>
            </div>
          </div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Register;
