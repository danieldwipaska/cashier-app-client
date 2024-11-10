import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import Select, { SelectChangeEvent } from '@mui/material/Select';

import { FaTrash } from 'react-icons/fa6';
import { FaEdit } from 'react-icons/fa';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Modal, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const updateFnbModalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const MenuManagement = () => {
  const [newMenuFormCategory, setNewMenuFormCategory] = useState('');
  const [newMenuFormName, setNewMenuFormName] = useState('');
  const [newMenuFormPrice, setNewMenuFormPrice] = useState('');
  const [newCategoryFormName, setNewCategoryFormName] = useState('');
  const [categorySubmitIsSuccess, setCategorySubmitIsSuccess] = useState(false);
  const [fnbSubmitIsSuccess, setFnbSubmitIsSuccess] = useState(false);
  const [openFnbDialog, setOpenFnbDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);

  const [deletedFnbId, setDeletedFnbId] = useState('');
  const [deletedFnbName, setDeletedFnbName] = useState('');
  const [deletedCategoryId, setDeletedCategoryId] = useState('');
  const [deletedCategoryName, setDeletedCategoryName] = useState('');

  // Handle Update Fnb Modal
  const [openUpdateFnbModal, setOpenUpdateFnbModal] = useState(false);
  const handleOpenUpdateFnbModal = async (id: string) => {
    try {
      const res = await axios.get(`http://localhost:3001/fnbs/${id}`);

      setFnbId(res.data.data.id);
      setFnbName(res.data.data.name);
      setFnbPrice(res.data.data.price);
      setFnbCategory(res.data.data.category.name);
      setFnbDiscountPercent(res.data.data.discount_percent);
      setOpenUpdateFnbModal(true);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCloseUpdateFnbModal = () => setOpenUpdateFnbModal(false);

  // Fnb Data for Update Modal
  const [fnbId, setFnbId] = useState('');
  const [fnbName, setFnbName] = useState('');
  const [fnbPrice, setFnbPrice] = useState('');
  const [fnbCategory, setFnbCategory] = useState('');
  const [fnbDiscountPercent, setFnbDiscountPercent] = useState(0);

  // Handle Change Fnb Data for Update Modal
  const handleChangeFnbName = (event: any) => {
    setFnbName(event.target.value);
  };

  const handleChangeFnbPrice = (event: any) => {
    setFnbPrice(event.target.value);
  };

  const handleChangeFnbCategory = (event: any) => {
    setFnbCategory(event.target.value);
  };

  const handleChangeFnbDiscountPercent = (event: any) => {
    setFnbDiscountPercent(Number(event.target.value));
  };

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
      await axios.post('http://localhost:3001/fnbs', formData);

      fnbsRefetch();
      setNewMenuFormName('');
      setNewMenuFormCategory('');
      setNewMenuFormPrice('');

      setFnbSubmitIsSuccess(true);
      setTimeout(() => {
        setFnbSubmitIsSuccess(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const submitNewCategory = async () => {
    const formData = {
      name: newCategoryFormName,
    };

    try {
      await axios.post('http://localhost:3001/categories', formData);

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

  const updateFnbDiscountStatus = async (id: string, discountStatus: boolean) => {
    try {
      await axios.patch(`http://localhost:3001/fnbs/${id}`, { discount_status: discountStatus });

      fnbsRefetch();
    } catch (error) {
      console.log(error);
    }
  };

  // Update Fnb Data
  const updateFnb = async () => {
    try {
      await axios.patch(`http://localhost:3001/fnbs/${fnbId}`, { name: fnbName, price: Number(fnbPrice), categoryId: categories.find((category: any) => category.name === fnbCategory).id, discount_percent: Number(fnbDiscountPercent) });

      fnbsRefetch();
      handleCloseUpdateFnbModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-200 max-h-screen pt-20 px-8 w-11/12">
      <div className="bg-white mt-2 pt-4 pb-8 px-5 rounded-md h-5/6 overflow-y-auto">
        <div className="mx-5">
          <div className="mb-2 border-b">
            <p className="text-lg text-gray-500">Menu</p>
          </div>

          <div className="flex py-2">
            <FormControl size="small" sx={{ m: 0, minWidth: 120 }}>
              <TextField id="outlined-basic" label="Name" variant="outlined" size="small" onChange={handleNewMenuNameChange} value={newMenuFormName} />
            </FormControl>

            <FormControl sx={{ minWidth: 120, mx: 2 }} size="small">
              <InputLabel id="demo-select-small-label">Category</InputLabel>
              <Select labelId="demo-select-small-label" id="demo-select-small" value={newMenuFormCategory} label="Category" onChange={handleNewMenuCategoryChange}>
                {categories?.map((category: any) => (
                  <MenuItem value={category.id}>{category.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120, mr: 2 }}>
              <TextField id="outlined-basic" type="number" label="Price" variant="outlined" size="small" onChange={handleNewMenuPriceChange} value={newMenuFormPrice} />
            </FormControl>
            <button className="text-center py-2 px-3 bg-green-500 hover:bg-green-500/40 duration-500 rounded-md" onClick={submitNewMenu}>
              Add Menu
            </button>
            {fnbSubmitIsSuccess ? (
              <Stack spacing={0} sx={{ mx: 2 }}>
                <Alert severity="success" sx={{ py: 0 }}>
                  added
                </Alert>
              </Stack>
            ) : null}
          </div>
          <div className="overflow-y-auto border border-black/30 rounded-md pl-2" style={{ height: '250px' }}>
            <table className="table-auto">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="text-left ">
                  <th>No.</th>
                  <th className="px-4 py-2">Details</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Discount Status</th>
                  <th className="px-4 py-2">Discount Percent(%)</th>
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
                      {fnb.discount_status ? (
                        <Switch
                          {...label}
                          defaultChecked
                          color="success"
                          size="small"
                          onClick={() => {
                            updateFnbDiscountStatus(fnb.id, !fnb.discount_status);
                          }}
                        />
                      ) : (
                        <Switch
                          {...label}
                          color="success"
                          size="small"
                          onClick={() => {
                            updateFnbDiscountStatus(fnb.id, !fnb.discount_status);
                          }}
                        />
                      )}
                    </td>
                    <td className="py-0 px-4 text-sm">{fnb.discount_percent}</td>
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
                    <td className="py-0 px-4 text-sm">{new Date(fnb.created_at).toLocaleDateString()}</td>
                    <td className="py-0 flex justify-center">
                      <button
                        className="my-2 mx-1"
                        onClick={() => {
                          handleOpenUpdateFnbModal(fnb.id);
                        }}
                      >
                        <FaEdit size={15} color="#000000" />
                      </button>
                      <button
                        className="my-2 mx-1"
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
          <div className="mt-5 border-b">
            <p className="text-lg text-gray-500">List of Categories</p>
          </div>
          <div className="mt-2">
            <div className="flex py-2">
              <FormControl size="small" sx={{ mr: 2, minWidth: 120 }}>
                <TextField id="outlined-basic" label="Name" variant="outlined" size="small" onChange={handleNewCategoryNameChange} value={newCategoryFormName} />
              </FormControl>
              <button className="text-center py-2 px-3 bg-green-500 hover:bg-green-500/40 duration-500 rounded-md" onClick={submitNewCategory}>
                Add Category
              </button>
              {categorySubmitIsSuccess ? (
                <Stack spacing={0} sx={{ mx: 2 }}>
                  <Alert severity="success" sx={{ py: 0 }}>
                    added
                  </Alert>
                </Stack>
              ) : null}
            </div>
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
                      <td className="py-0 px-4 text-sm">{new Date(category.created_at).toLocaleDateString()}</td>
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
      <Modal open={openUpdateFnbModal} onClose={handleCloseUpdateFnbModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={updateFnbModalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Food / Beverages
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <div className="my-3">
              <TextField id="outlined-basic" label="Name" variant="outlined" size="small" onChange={handleChangeFnbName} value={fnbName} />
            </div>
            <div className="my-3">
              <FormControl size="small">
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select labelId="demo-simple-select-label" id="demo-simple-select" value={fnbCategory} label="Category" onChange={handleChangeFnbCategory}>
                  {categories?.map((category: any) => (
                    <MenuItem value={category.name}>{category.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="my-3">
              <TextField id="outlined-basic" label="Outlined" variant="outlined" size="small" onChange={handleChangeFnbPrice} value={fnbPrice} />
            </div>
            <div className="my-3">
              <TextField id="outlined-basic" label="Outlined" variant="outlined" size="small" onChange={handleChangeFnbDiscountPercent} value={fnbDiscountPercent} />
            </div>
          </Typography>
          <Typography id="modal-modal-footer" sx={{ mt: 4 }}>
            <div className="flex justify-end">
              <div>
                <Button variant="contained" color="inherit" sx={{ mx: 1 }} onClick={handleCloseUpdateFnbModal}>
                  Cancel
                </Button>
                <Button variant="contained" color="success" onClick={updateFnb}>
                  Submit
                </Button>
              </div>
            </div>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default MenuManagement;
