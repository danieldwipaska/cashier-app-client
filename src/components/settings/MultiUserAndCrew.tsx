import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';
import UpdateCrewModal from '../UpdateCrewModal';

const MultiUserAndCrew = ({ shopId }: { shopId: string }) => {
  // Crew Form
  const [name, setName] = React.useState('');
  const [code, setCode] = React.useState('');
  const [position, setPosition] = React.useState('');

  // MultiUser Form
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState('');

  // Successful Submit Notification
  const [crewSubmitIsSuccess, setCrewSubmitIsSuccess] = React.useState(false);
  const [userSubmitIsSuccess, setUserSubmitIsSuccess] = React.useState(false);

  // Crew Delete Dialog
  const [openCrewDialog, setOpenCrewDialog] = React.useState(false);
  const [deletedCrewId, setDeletedCrewId] = React.useState('');
  const [deletedCrewName, setDeletedCrewName] = React.useState('');

  // Crew Update Modal
  const [openUpdateCrewModal, setOpenUpdateCrewModal] = React.useState(false);
  const [updatedCrewId, setUpdatedCrewId] = React.useState('');
  const [updatedCrewName, setUpdatedCrewName] = React.useState('');
  const [updatedCrewCode, setUpdatedCrewCode] = React.useState('');
  const [updatedCrewPosition, setUpdatedCrewPosition] = React.useState('');
  const handleOpenUpdateCrewModal = async (id: string) => {
    try {
      const res = await axios.get(`http://localhost:3001/crews/${id}`);

      setUpdatedCrewId(res.data.data.id);
      setUpdatedCrewName(res.data.data.name);
      setUpdatedCrewCode(res.data.data.code);
      setUpdatedCrewPosition(res.data.data.position);
      setOpenUpdateCrewModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  // FindAll Crew Query
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

  // FindAll MultiUser Query
  const { data: multiusers, refetch: multiusersRefetch } = useQuery({
    queryKey: ['multiusers'],
    queryFn: () =>
      axios
        .get('http://localhost:3001/multiusers', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  // Handle Crew Form
  const handleNameChange = (event: any) => {
    setName(event.target.value as string);
  };

  const handleCodeChange = (event: any) => {
    setCode(event.target.value as string);
  };

  const handlePositionChange = (event: any) => {
    setPosition(event.target.value as string);
  };

  // Handle MultiUser Form
  const handleUsernameChange = (event: any) => {
    setUsername(event.target.value as string);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value as string);
  };
  const handleRoleChange = (event: any) => {
    setRole(event.target.value as string);
  };

  const handleAddCrewClick = async () => {
    try {
      await axios.post('http://localhost:3001/crews', { name, code, position, shopId });

      crewsRefetch();
      setName('');
      setCode('');
      setPosition('');

      setCrewSubmitIsSuccess(true);
      setTimeout(() => {
        setCrewSubmitIsSuccess(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddUserClick = async () => {
    try {
      await axios.post('http://localhost:3001/multiusers', { username, password, role, shopId });

      multiusersRefetch();
      setUsername('');
      setPassword('');
      setRole('');

      setUserSubmitIsSuccess(true);
      setTimeout(() => {
        setUserSubmitIsSuccess(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickOpenCrewDialog = (id: string, name: string) => {
    setDeletedCrewId(id);
    setDeletedCrewName(name);
    setOpenCrewDialog(true);
  };

  const handleCloseCrewDialog = () => {
    setOpenCrewDialog(false);
  };

  const deleteCrew = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/crews/${id}`);

      crewsRefetch();
    } catch (error) {
      console.log(error);
    }
  };

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
              <TextField label="Name" variant="outlined" size="small" value={name} onChange={handleNameChange} />
            </div>
            <div className="mx-2">
              <TextField type="password" label="Code" variant="outlined" size="small" value={code} onChange={handleCodeChange} />
            </div>
            <div className="mx-2">
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel id="demo-select-small-label">Position</InputLabel>
                <Select labelId="demo-select-small-label" id="demo-select-small" value={position} label="Position" onChange={handlePositionChange}>
                  <MenuItem value="server">Server</MenuItem>
                  <MenuItem value="bartender">Bartender</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="mx-1">
              <Button variant="contained" color="success" onClick={handleAddCrewClick}>
                Add
              </Button>
            </div>
            <div className="mx-2">
              {crewSubmitIsSuccess ? (
                <Stack spacing={0} sx={{ mx: 2 }}>
                  <Alert severity="success" sx={{ py: 0 }}>
                    added / updated
                  </Alert>
                </Stack>
              ) : null}
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
                    <td className="py-0 px-4">
                      <button
                        className="my-2 mx-1"
                        onClick={() => {
                          handleOpenUpdateCrewModal(crew.id);
                        }}
                      >
                        <FaEdit size={15} color="#000000" />
                      </button>
                      <button
                        className="my-2 mx-1"
                        onClick={() => {
                          handleClickOpenCrewDialog(crew.id, crew.name);
                        }}
                      >
                        <FaTrash size={15} color="#DE4547" />
                      </button>
                    </td>
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
              <TextField id="outlined-basic" label="Username" variant="outlined" size="small" value={username} onChange={handleUsernameChange} />
            </div>
            <div className="mx-2">
              <TextField id="outlined-basic" label="Password" variant="outlined" size="small" type="password" value={password} onChange={handlePasswordChange} />
            </div>
            <div className="mx-2">
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel id="demo-select-small-label">Role</InputLabel>
                <Select labelId="demo-select-small-label" id="demo-select-small" value={role} label="Role" onChange={handleRoleChange}>
                  <MenuItem value="server">Greeter</MenuItem>
                  <MenuItem value="bartender">Server</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="mx-1">
              <Button variant="contained" color="success" onClick={handleAddUserClick}>
                Add
              </Button>
            </div>
            <div className="mx-2">
              {userSubmitIsSuccess ? (
                <Stack spacing={0} sx={{ mx: 2 }}>
                  <Alert severity="success" sx={{ py: 0 }}>
                    added / updated
                  </Alert>
                </Stack>
              ) : null}
            </div>
          </div>
          <div className="overflow-y-auto border border-black/30 rounded-md pl-2 mx-6 mt-4" style={{ height: '250px' }}>
            <table className="table-auto w-full">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="text-left ">
                  <th>No.</th>
                  <th className="px-4 py-2">Username</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody className="">
                {multiusers?.map((multiuser: any, i: number) => (
                  <tr className="hover:bg-gray-100 duration-200">
                    <td className="py-0 text-sm">{i + 1}</td>
                    <td className="py-0 px-4 text-sm">{multiuser.username}</td>
                    <td className="py-0 px-4 text-sm">{multiuser.role}</td>
                    <td className="py-0 px-4">
                      <button className="my-2 mx-1">
                        <FaEdit size={15} color="#000000" />
                      </button>
                      <button className="my-2 mx-1">
                        <FaTrash size={15} color="#DE4547" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Dialog open={openCrewDialog} onClose={handleCloseCrewDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{'Warning!!!'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Are you sure to delete "{deletedCrewName}" from list of Crew?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCrewDialog}>Cancel</Button>
          <Button
            onClick={() => {
              deleteCrew(deletedCrewId);
              setOpenCrewDialog(false);
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <UpdateCrewModal
        openUpdateModal={openUpdateCrewModal}
        setOpenUpdateModal={setOpenUpdateCrewModal}
        setSubmitIsSuccess={setCrewSubmitIsSuccess}
        refetch={crewsRefetch}
        updatedId={updatedCrewId}
        setUpdatedId={setUpdatedCrewId}
        updatedName={updatedCrewName}
        setUpdatedName={setUpdatedCrewName}
        updatedCode={updatedCrewCode}
        setUpdatedCode={setUpdatedCrewCode}
        updatedPosition={updatedCrewPosition}
        setUpdatedPosition={setUpdatedCrewPosition}
      />
    </div>
  );
};

export default MultiUserAndCrew;
