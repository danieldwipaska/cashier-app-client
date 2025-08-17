import { Badge, Box, CircularProgress, FormControl, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, SelectChangeEvent, useMediaQuery } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { addOrUpdateItem, Item } from 'context/slices/orderSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import CustomPrice from './CustomPrice';

const Menu = (props: any): JSX.Element => {
  const { openSummary } = props;
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchedMenu, setSearchedMenu] = useState('');
  const [openCustomPrice, setOpenCustomPrice] = useState(false);
  const dispatch = useDispatch();
  const widthMinMd = useMediaQuery('(min-width:768px)');

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

  const {
    data: availableFnbsByCategory,
    refetch: fnbsRefetch,
    isLoading: dataLoading,
  } = useQuery({
    queryKey: ['availableFnbsByCategory'],
    queryFn: async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/fnbs?pagination=false`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        });

        const availableFnbs = res.data.data.filter((fnb: any) => {
          return fnb.availability === true && fnb.is_active && fnb.id !== process.env.REACT_APP_CUSTOM_FNB_ID;
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

  const addFnbToOrder = async (fnb: any) => {
    const item: Item = {
      fnb_id: fnb.id,
      amount: 1,
      price: fnb.price,
      discount_percent: fnb.discount_status ? fnb.discount_percent : 0,
      fnb_name: fnb.name,
      fnb_category: fnb.category.name,
      modifiers: fnb.FnbModifier.map((fnbModifier: any) => {
        return {
          ...fnbModifier.modifier,
          checked: false,
        };
      }),
    };

    dispatch(addOrUpdateItem(item));
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
    <div className="bg-gray-200 max-h-screen pt-16 md:pt-20 pb-20 md:pb-0 px-6 md:px-8 w-full md:w-6/12">
      <div className="flex flex-row mt-3 justify-between flex-wrap gap-4">
        <Box sx={{ minWidth: 200, backgroundColor: 'whitesmoke', order: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={selectedCategory} label="Category" onChange={handleSelectCategoryChange}>
              <MenuItem value={'All'} key={-1}>
                All
              </MenuItem>
              {categories?.map((category: any) => (
                <MenuItem value={category.id} key={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <input type="text" className="px-3 py-2 border border-black/40 rounded-md order-1" placeholder="Search..." onChange={handleSearchMenuChange} />
      </div>
      <div className="bg-white mt-5 rounded-md px-5 py-3 h-4/5 w-full">
        <div className="flex justify-between items-center">
          <p className="text-xl mx-2 font-semibold">Menu</p>
          <button className={`bg-green-300 py-2 px-3 rounded-lg ${openSummary ? 'opacity-60' : ''}`} onClick={() => setOpenCustomPrice(true)} disabled={openSummary}>
            Custom
          </button>
        </div>
        <div className="mt-6 h-5/6 overflow-y-auto border rounded-md" style={{ width: '100%' }}>
          {dataLoading ? (
            <div className="h-full w-full relative">
              <div className="flex items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-10">
                loading
                <CircularProgress color="success" size={15} />
              </div>
            </div>
          ) : (
            <Box sx={{ m: 0, width: 'inherit', bgcolor: 'background.paper' }}>
              <div aria-label="main mailbox folders">
                <List disablePadding>
                  {availableFnbsByCategory?.map((fnb: any) => (
                    <ListItem disablePadding sx={{ borderBottom: '1px solid #e0e0e0' }} key={fnb.id}>
                      {openSummary ? (
                        <ListItemButton sx={{ p: widthMinMd ? 2 : 1 }} disabled>
                          <ListItemIcon sx={{ width: 100 }}>
                            <div className="w-full flex justify-end">
                              <p className="text-[10px] md:text-xs rounded-full bg-green-200 px-3 py-1">{fnb.category.name}</p>
                            </div>
                          </ListItemIcon>
                          <ListItemText primary={<p className='text-sm md:text-base'>{fnb.name}</p>} sx={{ mx: 2 }} />
                        </ListItemButton>
                      ) : (
                        <ListItemButton
                          sx={{ p: widthMinMd ? 2 : 1 }}
                          onClick={() => {
                            addFnbToOrder(fnb);
                          }}
                        >
                          <ListItemIcon sx={{ width: 100 }}>
                            <div className="w-full flex justify-end">
                              <p className="text-[10px] md:text-xs rounded-full bg-green-200 px-3 py-1">{fnb.category.name}</p>
                            </div>
                          </ListItemIcon>
                          {fnb.discount_status ? (
                            <Badge badgeContent={`-${fnb.discount_percent}%`} color="warning">
                              <ListItemText primary={<p className='text-sm md:text-base'>{fnb.name}</p>} sx={{ mx: 2 }} />
                            </Badge>
                          ) : (
                            <ListItemText primary={<p className='text-sm md:text-base'>{fnb.name}</p>} sx={{ mx: 2 }} />
                          )}
                        </ListItemButton>
                      )}
                    </ListItem>
                  ))}
                </List>
              </div>
            </Box>
          )}
        </div>
      </div>
      <CustomPrice open={openCustomPrice} setOpen={setOpenCustomPrice} />
    </div>
  );
};

export default Menu;
