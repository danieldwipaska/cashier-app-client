import { FormControl, FormControlLabel, FormGroup, FormLabel, Switch, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';

const General = () => {
  const [discountStatus, setDiscountStatus] = React.useState(false);

  const { data: shop } = useQuery({
    queryKey: ['shop'],
    queryFn: () =>
      axios
        .get(`http://localhost:3001/shops?user=${localStorage.getItem('username')}`)
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  return (
    <div className="overflow-y-auto h-96">
      <div>
        <div className=" border-b border-gray-300 py-1">
          <p className=" text-gray-500">Orders</p>
        </div>
        <div>
          <div>
            <FormControl component="fieldset" sx={{ mt: 2, px: 3 }}>
              <FormLabel component="legend" color="success">
                All menus' Discounts (%)
              </FormLabel>
              <FormGroup aria-label="position" row>
                <div className="flex items-center">
                  <div>
                    <Switch sx={{ my: 0 }} color="success" />
                  </div>
                  <div className="pb-0">
                    <TextField disabled id="standard-basic" variant="standard" value={'20'} />
                  </div>
                </div>
              </FormGroup>
            </FormControl>
          </div>
          <div>
            <FormControl component="fieldset" sx={{ mt: 2, px: 3 }}>
              <FormLabel component="legend" color="success">
                Tax (%)
              </FormLabel>
              <FormGroup aria-label="position" row>
                <div className="flex items-center">
                  <div>
                    <Switch sx={{ my: 0 }} color="success" />
                  </div>
                  <div className="pb-0">
                    <TextField disabled id="standard-basic" variant="standard" value={'20'} />
                  </div>
                </div>
              </FormGroup>
            </FormControl>
          </div>
          <div>
            <FormControl component="fieldset" sx={{ mt: 2, px: 3 }}>
              <FormLabel component="legend" color="success">
                Service (%)
              </FormLabel>
              <FormGroup aria-label="position" row>
                <div className="flex items-center">
                  <div>
                    <Switch sx={{ my: 0 }} color="success" />
                  </div>
                  <div className="pb-0">
                    <TextField disabled id="standard-basic" variant="standard" value={'20'} />
                  </div>
                </div>
              </FormGroup>
            </FormControl>
          </div>
          <div className="mt-5">
            <FormControl component="fieldset" sx={{ mt: 2, px: 3 }}>
              <FormLabel component="legend" color="success">
                Include Tax and/or Service <br /> without additional payments
              </FormLabel>
              <Switch color="success" />
            </FormControl>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className=" border-b border-gray-300 py-1">
          <p className="text-gray-500">Gift Card</p>
        </div>
        <div>
          <FormControl component="fieldset" sx={{ mt: 2, px: 3 }}>
            <FormLabel component="legend" color="success">
              Topup Discounts (%)
            </FormLabel>
            <FormGroup aria-label="position" row>
              <div className="flex items-center">
                <div>
                  <Switch sx={{ my: 0 }} color="success" />
                </div>
                <div className="pb-0">
                  <TextField disabled id="standard-basic" variant="standard" value={'20'} />
                </div>
              </div>
            </FormGroup>
          </FormControl>
        </div>
      </div>
    </div>
  );
};

export default General;
