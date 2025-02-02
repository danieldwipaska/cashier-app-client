import axios from 'axios';
import { API_BASE_URL, ErrorMessage } from 'configs/utils';
import { Card } from 'lib/interfaces/cards';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import SimpleSnackbar from '../../components/snackbars/SimpleSnackbar';

const SearchCard = ({ setCardData }: { setCardData: React.Dispatch<React.SetStateAction<Card | null>> }) => {
  const { handleSubmit, register } = useForm();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cards/${data.cardNumber}`);

      const cardData: Card = {
        id: response.data.data.id,
        cardNumber: response.data.data.card_number,
        customerName: response.data.data.customer_name,
        customerId: response.data.data.customer_id,
        balance: response.data.data.balance,
        status: response.data.data.status,
        updatedAt: response.data.data.updated_at,
      };

      setCardData(cardData);
      return;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error?.response?.data?.statusCode === 404) setSnackbarMessage(ErrorMessage.CARD_NOT_FOUND);
        if (error?.response?.data?.statusCode === 500) setSnackbarMessage('Server Error');
      } else {
        setSnackbarMessage('Unknown Error');
        console.error(error);
      }

      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white">
        <div className="flex flex-col gap-4 p-8">
          <div className="flex justify-between items-center">
            <div className="font-semibold text-gray-800">Search Card</div>
          </div>
          <div>
            <input {...register('cardNumber')} type="text" className="px-5 py-2 border" id="cardNumber" placeholder="Enter card number" />
          </div>
          <button className="py-2 bg-green-400">Search</button>
        </div>
      </form>
      <SimpleSnackbar open={openSnackbar} setOpen={setOpenSnackbar} message={snackbarMessage} />
    </>
  );
};

export default SearchCard;
