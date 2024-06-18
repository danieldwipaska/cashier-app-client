import { Badge, Box, Chip, FormControl, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import { IoFastFoodOutline } from 'react-icons/io5';

const Menu = (props: any): JSX.Element => {
  const { orders, setOrders, openSummary } = props;
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data: categories } = useQuery({
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

  const { data: availableFnbsByCategory, refetch: fnbsRefetch } = useQuery({
    queryKey: ['availableFnbsByCategory'],
    queryFn: async () => {
      try {
        const res = await axios.get('http://localhost:3001/fnbs');

        const availableFnbs = res.data.data.filter((fnb: any) => {
          return fnb.availability === true;
        });

        if (selectedCategory === 'All') {
          return availableFnbs;
        }

        const data: any = availableFnbs.filter((fnb: any) => {
          return fnb.category.id === selectedCategory;
        });

        return data;
      } catch (error) {
        return console.log(error);
      }
    },
  });

  const addFnbToOrder = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/fnbs/${id}`);

      if (response.data.statusCode === 200) {
        // check if exist
        const check: any = [];

        orders?.forEach((order: any) => {
          if (order.id === id) {
            check.push(id);
            order.amount++;
            setOrders([...orders]);
          }
        });

        if (!check.length)
          setOrders([
            ...orders,
            {
              id: response.data.data.id,
              name: response.data.data.name,
              category: response.data.data.category,
              price: response.data.data.price,
              discount_status: response.data.data.discount_status,
              discount_percent: response.data.data.discount_percent,
              amount: 1,
            },
          ]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value);
    setTimeout(() => {
      fnbsRefetch();
    }, 500);
  };

  return (
    <div className="bg-gray-200 max-h-screen pt-20 px-8 w-8/12">
      <div className="flex flex-row mt-3">
        <Box sx={{ minWidth: 200, backgroundColor: 'whitesmoke' }}>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={selectedCategory} label="Category" onChange={handleSelectCategoryChange}>
              <MenuItem value={'All'}>All</MenuItem>
              {categories?.map((category: any) => (
                <MenuItem value={category.id}>{category.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </div>
      <div className="bg-white mt-5 rounded-md px-5 py-3 h-4/5 w-full">
        <div>
          <p className="text-xl mx-2 font-semibold">Menu</p>
        </div>
        <div className="mt-6 h-5/6 overflow-y-auto border rounded-md" style={{ width: '100%' }}>
          <Box sx={{ m: 0, width: 'inherit', bgcolor: 'background.paper' }}>
            <div aria-label="main mailbox folders">
              <List disablePadding>
                {availableFnbsByCategory?.map((fnb: any) => (
                  <ListItem disablePadding sx={{ borderBottom: '1px solid #e0e0e0' }}>
                    {openSummary ? (
                      <ListItemButton sx={{ p: 2 }} disabled>
                        <ListItemIcon sx={{ width: 100 }}>
                          <div className="w-full flex justify-end">
                            <p className="text-xs rounded-full bg-green-200 px-3 py-1">{fnb.category.name}</p>
                          </div>
                        </ListItemIcon>
                        <ListItemText primary={fnb.name} sx={{ mx: 2 }} />
                      </ListItemButton>
                    ) : (
                      <ListItemButton sx={{ p: 2 }} onClick={() => addFnbToOrder(fnb.id)}>
                        <ListItemIcon sx={{ width: 100 }}>
                          <div className="w-full flex justify-end">
                            <p className="text-xs rounded-full bg-green-200 px-3 py-1">{fnb.category.name}</p>
                          </div>
                        </ListItemIcon>
                        {fnb.discount_status ? (
                          <Badge badgeContent={`-${fnb.discount_percent}%`} color="warning">
                            <ListItemText primary={fnb.name} sx={{ mx: 2 }} />
                          </Badge>
                        ) : (
                          <ListItemText primary={fnb.name} sx={{ mx: 2 }} />
                        )}
                      </ListItemButton>
                    )}
                  </ListItem>
                ))}
              </List>
            </div>
          </Box>
          {/* {availableFnbsByCategory?.map((fnb: any) => (
            <div className="p-2 border border-black/40 rounded-lg grid grid-cols-1 content-between max-h-72">
              <div>
                <div className="bg-slate-800 p-5 rounded-lg flex justify-center">
                  <IoFastFoodOutline size={80} color="#ffffff" />
                </div>
                <div className="mt-2 flex">
                  <p className="text-xs rounded-full bg-green-200 px-3 py-1">{fnb.category.name}</p>
                </div>
                <div className="mt-1 mx-1">
                  <p className="text-sm">{fnb.name}</p>
                </div>
                <div className="mt-1 mx-1">
                  <p className="text-xs text-end">{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(fnb.price)}</p>
                </div>
              </div>
              <div className="mt-2">
                {openSummary ? (
                  fnb.discount_status ? (
                    <Badge badgeContent={`-${fnb.discount_percent}%`} color="warning" sx={{ width: '100%' }}>
                      <button
                        className="text-center text-xs bg-green-500 w-full rounded-md py-1"
                        onClick={() => {
                          addFnbToOrder(fnb.id);
                        }}
                        disabled
                      >
                        Add
                      </button>
                    </Badge>
                  ) : (
                    <button
                      className="text-center text-xs bg-green-500 w-full rounded-md py-1"
                      onClick={() => {
                        addFnbToOrder(fnb.id);
                      }}
                      disabled
                    >
                      Add
                    </button>
                  )
                ) : fnb.discount_status ? (
                  <Badge badgeContent={`-${fnb.discount_percent}%`} color="warning" sx={{ width: '100%' }}>
                    <button
                      className="text-center text-xs bg-green-500 hover:opacity-70 duration-500 w-full rounded-md py-1"
                      onClick={() => {
                        addFnbToOrder(fnb.id);
                      }}
                    >
                      Add
                    </button>
                  </Badge>
                ) : (
                  <button
                    className="text-center text-xs bg-green-500 hover:opacity-70 duration-500 w-full rounded-md py-1"
                    onClick={() => {
                      addFnbToOrder(fnb.id);
                    }}
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default Menu;
