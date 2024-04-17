import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import Select, { SelectChangeEvent } from '@mui/material/Select';

import { FaTrash } from 'react-icons/fa6';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const MenuManagement = () => {
  const [newMenuFormCategory, setNewMenuFormCategory] = useState('');
  const [newMenuFormName, setNewMenuFormName] = useState('');
  const [newMenuFormPrice, setNewMenuFormPrice] = useState('');
  const [newCategoryFormName, setNewCategoryFormName] = useState('');
  const [categorySubmitIsSuccess, setCategorySubmitIsSuccess] = useState(false);
  const [openFnbDialog, setOpenFnbDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);

  const [deletedFnbId, setDeletedFnbId] = useState('');
  const [deletedFnbName, setDeletedFnbName] = useState('');
  const [deletedCategoryId, setDeletedCategoryId] = useState('');
  const [deletedCategoryName, setDeletedCategoryName] = useState('');

  const handleClickOpenFnbDialog = (id: string, name: string) => {
    setDeletedFnbId(id);
    setDeletedFnbName(name);
    setOpenFnbDialog(true);
  };

  const handleCloseFnbDialog = () => {
    setOpenFnbDialog(false);
  };

  const handleClickOpenCategoryDialog = (id: string, name: string) => {
    setDeletedCategoryId(id);
    setDeletedCategoryName(name);
    setOpenCategoryDialog(true);
  };

  const handleCloseCategoryDialog = () => {
    setOpenCategoryDialog(false);
  };

  const { data: categories, refetch: categoriesRefetch } = useQuery({
    queryKey: ['categories'],
    queryFn: () =>
      axios
        .get('http://localhost:3001/categories')
        .then((res) => {
          // console.log(res.data);
          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  const { data: fnbs, refetch: fnbsRefetch } = useQuery({
    queryKey: ['fnbs'],
    queryFn: () =>
      axios
        .get('http://localhost:3001/fnbs')
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  const handleNewMenuCategoryChange = (event: SelectChangeEvent) => {
    setNewMenuFormCategory(event.target.value);
  };

  const handleNewMenuNameChange = (event: any) => {
    setNewMenuFormName(event.target.value);
  };

  const handleNewMenuPriceChange = (event: any) => {
    setNewMenuFormPrice(event.target.value);
  };

  const handleNewCategoryNameChange = (event: any) => {
    setNewCategoryFormName(event.target.value);
  };

  const submitNewMenu = async () => {
    const formData = {
      name: newMenuFormName,
      categoryId: newMenuFormCategory,
      price: Number(newMenuFormPrice),
    };

    try {
      const response = await axios.post('http://localhost:3001/fnbs', formData);

      fnbsRefetch();
      setNewMenuFormName('');
      setNewMenuFormCategory('');
      setNewMenuFormPrice('');
    } catch (error) {
      console.log(error);
    }
  };

  const submitNewCategory = async () => {
    const formData = {
      name: newCategoryFormName,
    };

    try {
      const response = await axios.post('http://localhost:3001/categories', formData);

      categoriesRefetch();

      setNewCategoryFormName('');

      setCategorySubmitIsSuccess(true);
      setTimeout(() => {
        setCategorySubmitIsSuccess(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFnb = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/fnbs/${id}`);

      fnbsRefetch();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/categories/${id}`);

      categoriesRefetch();
    } catch (error) {
      console.log(error);
    }
  };

  const updateFnbAvailability = async (id: string, availability: boolean) => {
    try {
      await axios.patch(`http://localhost:3001/fnbs/${id}`, { availability });

      fnbsRefetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-200 max-h-screen pt-20 px-8 w-11/12">
      <div className="bg-white mt-2 py-4 px-5 rounded-md">
        <div className="flex flex-row">
          <div className="">
            <div>
              <p>List of Menu</p>
            </div>
            <div className="overflow-y-auto border border-black/30 rounded-md pl-2" style={{ height: '250px' }}>
              <table className="table-auto">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="text-left ">
                    <th>No.</th>
                    <th className="px-4 py-2">Details</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Availability</th>
                    <th className="px-4 py-2">Created At</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody className="">
                  {fnbs?.map((fnb: any, i: number) => (
                    <tr className="border-b-2 hover:bg-gray-100 duration-50">
                      <td className="py-0 text-sm">{i + 1}</td>
                      <td className="py-0 px-4 text-sm">{fnb.name}</td>
                      <td className="py-0 px-4 text-sm">{fnb.category.name}</td>
                      <td className="py-0 px-4 text-sm">{Intl.NumberFormat('en-us').format(fnb.price)}</td>
                      <td className="py-0 px-4 text-sm flex justify-center">
                        {fnb.availability ? (
                          <Switch
                            {...label}
                            defaultChecked
                            color="success"
                            size="small"
                            onClick={() => {
                              updateFnbAvailability(fnb.id, !fnb.availability);
                            }}
                          />
                        ) : (
                          <Switch
                            {...label}
                            color="success"
                            size="small"
                            onClick={() => {
                              updateFnbAvailability(fnb.id, !fnb.availability);
                            }}
                          />
                        )}
                      </td>
                      <td className="py-0 px-4 text-sm">{new Date(fnb.created_at).toLocaleString()}</td>
                      <td className="py-0 flex justify-center">
                        <button
                          className="my-2"
                          onClick={() => {
                            handleClickOpenFnbDialog(fnb.id, fnb.name);
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
            <div className="mt-3">
              <p>List of Categories</p>
            </div>
            <div className="flex">
              <div className="overflow-y-auto border border-black/30 rounded-md pl-2" style={{ height: '200px' }}>
                <table className="table-auto">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="text-left ">
                      <th>No.</th>
                      <th className="px-4 py-2">Details</th>
                      <th className="px-4 py-2">Created At</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {categories?.map((category: any, i: number) => (
                      <tr className="border-b-2 hover:bg-gray-100 duration-50">
                        <td className="py-0 text-sm">{i + 1}</td>
                        <td className="py-0 px-4 text-sm">{category.name}</td>
                        <td className="py-0 px-4 text-sm">{new Date(category.created_at).toLocaleString()}</td>
                        <td className="py-0 flex justify-center">
                          <button
                            className="my-2"
                            onClick={() => {
                              handleClickOpenCategoryDialog(category.id, category.name);
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
          <div className="ml-5 overflow-y-auto" style={{ height: '470px' }}>
            <div className="py-1 px-4">
              <div className="border-b border-gray-300">
                <p>New Menu</p>
              </div>
              <div className="flex flex-col py-2">
                <FormControl size="small" sx={{ m: 0, minWidth: 120 }}>
                  <TextField id="outlined-basic" label="Name" variant="outlined" size="small" onChange={handleNewMenuNameChange} value={newMenuFormName} />
                </FormControl>

                <FormControl sx={{ mt: 2, minWidth: 120 }} size="small">
                  <InputLabel id="demo-select-small-label">Category</InputLabel>
                  <Select labelId="demo-select-small-label" id="demo-select-small" value={newMenuFormCategory} label="Category" onChange={handleNewMenuCategoryChange}>
                    {categories?.map((category: any) => (
                      <MenuItem value={category.id}>{category.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ mt: 2, minWidth: 120 }}>
                  <TextField id="outlined-basic" type="number" label="Price" variant="outlined" size="small" onChange={handleNewMenuPriceChange} value={newMenuFormPrice} />
                </FormControl>
              </div>
              <div className="">
                <button className="text-center w-full py-2 px-3 bg-green-500 hover:bg-green-500/40 duration-500 rounded-md" onClick={submitNewMenu}>
                  Add Menu
                </button>
              </div>
            </div>

            <div className="py-1 px-4 mt-2">
              <div className="border-b border-gray-300">
                <p>New Category</p>
              </div>
              <div className="flex flex-col py-2">
                <FormControl size="small" sx={{ m: 0, minWidth: 120 }}>
                  <TextField id="outlined-basic" label="Name" variant="outlined" size="small" onChange={handleNewCategoryNameChange} value={newCategoryFormName} />
                </FormControl>
              </div>
              <div className="mb-4">
                <button className="text-center w-full py-2 px-3 bg-green-500 hover:bg-green-500/40 duration-500 rounded-md" onClick={submitNewCategory}>
                  Add Category
                </button>
              </div>
              {categorySubmitIsSuccess ? (
                <Stack sx={{ width: '100%' }} spacing={2}>
                  <Alert severity="success">Successfully added</Alert>
                </Stack>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <Dialog open={openFnbDialog} onClose={handleCloseFnbDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{'Warning!!!'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Are you sure to delete "{deletedFnbName}" from list of menu?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFnbDialog}>Cancel</Button>
          <Button
            onClick={() => {
              deleteFnb(deletedFnbId);
              setOpenFnbDialog(false);
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCategoryDialog} onClose={handleCloseCategoryDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{'Warning!!!'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Are you sure to delete "{deletedCategoryName}" from list of category?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCategoryDialog}>Cancel</Button>
          <Button
            onClick={() => {
              deleteCategory(deletedCategoryId);
              setOpenCategoryDialog(false);
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MenuManagement;
