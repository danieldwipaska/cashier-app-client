import { Badge, Box, FormControl, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { addOrUpdateItem, Item } from 'context/slices/orderSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

const Menu = (props: any): JSX.Element => {
  const { openSummary } = props;
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchedMenu, setSearchedMenu] = useState('');
  const dispatch = useDispatch();
  

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () =>
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/categories`, {
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

  const { data: availableFnbsByCategory, refetch: fnbsRefetch } = useQuery({
    queryKey: ['availableFnbsByCategory'],
    queryFn: async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/fnbs?pagination=false`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        });

        const availableFnbs = res.data.data.filter((fnb: any) => {
          return fnb.availability === true;
        });

        if (selectedCategory === 'All' && !searchedMenu) {
          return availableFnbs;
        }

        if (searchedMenu) {
          const data: any = availableFnbs.filter((fnb: any) => {
            return fnb.name.toLowerCase().indexOf(searchedMenu.toLowerCase()) !== -1;
          });

          return data;
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
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/fnbs/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      });

      if (response.data.statusCode === 200) {
        const fnb = response.data.data;
        const item: Item = {
          fnb_id: fnb.id,
          amount: 1,
          price: fnb.price,
          discount_percent: fnb.discount_status ? fnb.discount_percent : 0,
          fnb_name: fnb.name,
          fnb_category: fnb.category.name,
        }

        dispatch(addOrUpdateItem(item));
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

  const handleSearchMenuChange = (event: any) => {
    setSelectedCategory('All');
    setSearchedMenu(event.target.value);
    setTimeout(() => {
      fnbsRefetch();
    }, 500);
  };

  return (
    <div className="bg-gray-200 max-h-screen pt-20 px-8 w-7/12">
      <div className="flex flex-row mt-3 justify-between">
        <Box sx={{ minWidth: 200, backgroundColor: 'whitesmoke' }}>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={selectedCategory} label="Category" onChange={handleSelectCategoryChange}>
              <MenuItem value={'All'} key={-1}>All</MenuItem>
              {categories?.map((category: any) => (
                <MenuItem value={category.id} key={category.id}>{category.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <input type="text" className="px-3 py-2 border border-black/40 rounded-md" placeholder="Search..." onChange={handleSearchMenuChange} />
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
                  <ListItem disablePadding sx={{ borderBottom: '1px solid #e0e0e0' }} key={fnb.id}>
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
        </div>
      </div>
    </div>
  );
};

export default Menu;
