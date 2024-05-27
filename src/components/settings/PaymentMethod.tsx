import { Button, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';

const PaymentMethod = () => {
  const { data: paymentMethods, refetch: paymentMethodsRefetch } = useQuery({
    queryKey: ['paymentMethods'],
    queryFn: () =>
      axios
        .get('http://localhost:3001/payment-method')
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  return (
    <div className="overflow-y-auto" style={{ height: '650px' }}>
      <div>
        <div className=" border-b border-gray-300 py-1">
          <p className=" text-gray-500">Payment Method Management</p>
        </div>
        <div>
          <div className="mx-6 mt-4">
            <p>Add a New Crew</p>
          </div>
          <div className="mx-6 mt-2 flex">
            <div className="mr-2">
              <TextField id="outlined-basic" label="Name" variant="outlined" size="small" />
            </div>
            <div className="mx-1">
              <Button variant="contained" color="success">
                Add
              </Button>
            </div>
          </div>
          <div className="flex">
            <div className="overflow-y-auto pl-2 mx-6 mt-4 " style={{ maxHeight: '250px' }}>
              <table className="table-auto">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="text-left ">
                    <th>No.</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody className="">
                  {paymentMethods?.map((method: any, i: number) => (
                    <tr className="hover:bg-gray-100 duration-200">
                      <td className="py-0 text-sm">{i + 1}</td>
                      <td className="py-0 px-4 text-sm">{method.name}</td>
                      <td className="py-0 px-4 text-sm"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
