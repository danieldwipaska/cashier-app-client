import { Button, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';

const MultiUserAndCrew = () => {
  const { data: crews, refetch: crewsRefetch } = useQuery({
    queryKey: ['crews'],
    queryFn: () =>
      axios
        .get('http://localhost:3001/crews')
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
          <p className=" text-gray-500">Crew Management</p>
        </div>
        <div>
          <div className="mx-6 mt-4">
            <p>Add a New Crew</p>
          </div>
          <div className="mx-6 mt-2 flex">
            <div className="mr-2">
              <TextField id="outlined-basic" label="Name" variant="outlined" size="small" />
            </div>
            <div className="mx-2">
              <TextField id="outlined-basic" label="Code" variant="outlined" size="small" />
            </div>
            <div className="mx-2">
              <TextField id="outlined-basic" label="Position" variant="outlined" size="small" />
            </div>
            <div className="mx-1">
              <Button variant="contained" color="success">
                Add
              </Button>
            </div>
          </div>
          <div className="overflow-y-auto border border-black/30 rounded-md pl-2 mx-6 mt-4" style={{ height: '250px' }}>
            <table className="table-auto w-full">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="text-left ">
                  <th>No.</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Code</th>
                  <th className="px-4 py-2">Position</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody className="">
                {crews?.map((crew: any, i: number) => (
                  <tr className="hover:bg-gray-100 duration-200">
                    <td className="py-0 text-sm">{i + 1}</td>
                    <td className="py-0 px-4 text-sm">{crew.name}</td>
                    <td className="py-0 px-4 text-sm">
                      <input type="password" className=" bg-inherit" value={crew.code} disabled />
                    </td>
                    <td className="py-0 px-4 text-sm">{crew.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className=" border-b border-gray-300 py-1">
          <p className="text-gray-500">Multi-User Management</p>
        </div>
        <div>
          <div className="mx-6 mt-4">
            <p>Add a New User</p>
          </div>
          <div className="mx-6 mt-2 flex">
            <div className="mr-2">
              <TextField id="outlined-basic" label="Name" variant="outlined" size="small" />
            </div>
            <div className="mx-2">
              <TextField id="outlined-basic" label="Password" variant="outlined" size="small" type="password" />
            </div>
            <div className="mx-1">
              <Button variant="contained" color="success">
                Add
              </Button>
            </div>
          </div>
          <div className="overflow-y-auto border border-black/30 rounded-md pl-2 mx-6 mt-4" style={{ height: '250px' }}>
            <table className="table-auto w-full">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="text-left ">
                  <th>No.</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Code</th>
                  <th className="px-4 py-2">Position</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody className="">
                {crews?.map((crew: any, i: number) => (
                  <tr className="hover:bg-gray-100 duration-200">
                    <td className="py-0 text-sm">{i + 1}</td>
                    <td className="py-0 px-4 text-sm">{crew.name}</td>
                    <td className="py-0 px-4 text-sm">
                      <input type="password" className=" bg-inherit" value={crew.code} disabled />
                    </td>
                    <td className="py-0 px-4 text-sm">{crew.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiUserAndCrew;
