import React from 'react';
import bahariLogo from '../../img/Bahari_logo.jpg';
import { Button, TextField } from '@mui/material';

const Account = () => {
  return (
    <div className="overflow-y-auto h-96">
      <div>
        <div className="mx-6">
          <div className="flex items-center">
            <div>
              <img src={bahariLogo} alt="bahari" className=" border-2 rounded-full w-24" />
            </div>
            <div className="mx-8">
              <p>greeterbahari</p>
              <p>Admin</p>
            </div>
          </div>
          <div className="mt-3">
            <Button variant="contained" color="success" size="small">
              Change Logo
            </Button>
          </div>
        </div>
        <div className=" border-b border-gray-300 py-1 mt-7">
          <p className=" text-gray-500">Account Information</p>
        </div>
        <div className="mt-7 mx-6 ">
          <div>
            <TextField id="outlined-basic" label="Username" variant="outlined" size="small" />
          </div>
          <div className="mt-5">
            <TextField type="password" id="outlined-basic" label="Password" variant="outlined" size="small" />
          </div>
          <div className="mt-5">
            <TextField type="password" id="outlined-basic" label="Outlet" variant="outlined" size="small" />
          </div>
        </div>
        <div className="flex mt-16 mx-6">
          <div>
            <Button variant="contained" color="inherit" size="small">
              Cancel
            </Button>
          </div>
          <div className="mx-3">
            <Button variant="contained" color="success" size="small">
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
