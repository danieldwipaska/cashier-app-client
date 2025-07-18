import { Box, Modal } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { updateModifiers } from 'context/slices/orderSlice';
import { useEffect } from 'react'; // Import useEffect

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

const SetModifier = ({ open, setOpen, modifiers, fnbId, setModifiers }: { open: boolean; setOpen: any; modifiers: any; fnbId: string; setModifiers: any }) => {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!open) {
      reset();
      setModifiers(null);
    } else {
      if (modifiers) {
        const defaultValues: { modifiers: string[] } = { modifiers: [] };
        modifiers.forEach((modifier: any) => {
          if (modifier.checked) {
            defaultValues.modifiers.push(modifier.id);
          }
        });
        reset(defaultValues);
      }
    }
  }, [open, modifiers, reset, setModifiers]);

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (data: any) => {
    const payload = {
      fnb_id: fnbId,
      modifiers: modifiers,
    };
    dispatch(updateModifiers(payload));
    setOpen(false);
  };

  return (
    <>
      <Modal open={open} onClose={handleClose} aria-labelledby="child-modal-title" aria-describedby="child-modal-description">
        <Box sx={{ ...style, width: 400, border: 0 }}>
          <h4 className="mb-3">Modifier Options</h4>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
            <div className="flex flex-col gap-3 overflow-auto max-h-40">
              {modifiers?.length ? modifiers.map((modifier: any) => (
                <label key={modifier.id} htmlFor={`modifier-${modifier.id}`} className="flex gap-1 flex-1 min-w-32">
                  <input
                    type="checkbox"
                    id={`modifier-${modifier.id}`}
                    {...register('modifiers')}
                    value={modifier.id}
                    checked={modifier.checked}
                    onChange={(event) => {
                      const result = modifiers.map((option: any) => {
                        if (option.id === modifier.id) {
                          return {
                            ...option,
                            checked: event.target.checked,
                          };
                        }

                        return option;
                      });

                      setModifiers(result);
                    }}
                  />
                  {modifier.name}
                </label>
              )) : (<span className=' text-gray-400'>No Modifier Available</span>)}
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

export default SetModifier;
