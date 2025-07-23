import { Box, Modal } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { addOrUpdateItem, Item } from 'context/slices/orderSlice';
import { useState } from 'react';

// Modal Style
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const CustomPrice = ({ open, setOpen }: { open: boolean; setOpen: any }) => {
  const { handleSubmit } = useForm();
  const dispatch = useDispatch();
  const [customPrice, setCustomPrice] = useState<any>(0);
  const order = useSelector((state: any) => state.order.order);

  const handleClose = () => {
    setCustomPrice(0);
    setOpen(false);
  };

  const onSubmit = (_: any) => {
    const item: Item = {
      fnb_id: process.env.REACT_APP_CUSTOM_FNB_ID || '',
      amount: 1,
      price: customPrice,
      discount_percent: 0,
      fnb_name: process.env.REACT_APP_CUSTOM_FNB_NAME,
      fnb_category: 'Uncategorized',
      modifiers: [],
      note: '',
    };
    dispatch(addOrUpdateItem(item));

    setCustomPrice(0);
    setOpen(false);
  };

  return (
    <>
      <Modal open={open} onClose={handleClose} aria-labelledby="child-modal-title" aria-describedby="child-modal-description">
        <Box sx={{ ...style, width: 400, border: 0 }}>
          <h4 className="mb-3">Enter Custom Value</h4>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
            <div className="flex flex-col gap-3 overflow-auto max-h-40">
              <label className="flex gap-1 flex-1 min-w-32">
                <input
                  type="number"
                  value={customPrice}
                  onChange={(event) => {
                    setCustomPrice(event.target.value);
                  }}
                  className="px-5 py-2 border"
                  id="CustomPrice"
                  placeholder="Note..."
                />
              </label>
            </div>
            <br />
            <div>
              <button
                type="submit"
                className={`bg-green-400 py-2 px-3 rounded-lg ${order && order.items.length && order.items.some((item: Item) => item.fnb_id === process.env.REACT_APP_CUSTOM_FNB_ID) ? 'opacity-50' : 'opacity-100'}`}
                disabled={order && order.items.length && order.items.some((item: Item) => item.fnb_id === process.env.REACT_APP_CUSTOM_FNB_ID)}
              >
                Confirm
              </button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default CustomPrice;
