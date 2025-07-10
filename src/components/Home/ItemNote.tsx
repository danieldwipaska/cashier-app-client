import { Box, Modal } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { updateNote } from 'context/slices/orderSlice';

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

const ItemNote = ({ open, setOpen, note, setNote, fnbId }: { open: boolean; setOpen: any; note: any; setNote: any; fnbId: string }) => {
  const { handleSubmit } = useForm();
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (_: any) => {
    const payload = {
      fnb_id: fnbId,
      note,
    };
    dispatch(updateNote(payload));
    setOpen(false);
  };

  return (
    <>
      <Modal open={open} onClose={handleClose} aria-labelledby="child-modal-title" aria-describedby="child-modal-description">
        <Box sx={{ ...style, width: 400, border: 0 }}>
          <h4 className="mb-3">Enter Note</h4>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
            <div className="flex flex-col gap-3 overflow-auto max-h-40">
              <label className="flex gap-1 flex-1 min-w-32">
                <input
                  type="text"
                  value={note}
                  onChange={(event) => {
                    setNote(event.target.value);
                  }}
                  className="px-5 py-2 border" id="itemNote" placeholder="Note..."
                />
              </label>
            </div>
            <br />
            <div>
              <button type="submit" className="bg-green-400 py-2 px-3 rounded-lg">
                Confirm
              </button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default ItemNote;
