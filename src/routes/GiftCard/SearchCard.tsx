import axios from 'axios';
import { ErrorMessage } from 'configs/utils';
import { useMessages } from 'context/MessageContext';
import { Card } from 'lib/interfaces/cards';
import { useForm } from 'react-hook-form';

const SearchCard = ({ setCardData }: { setCardData: React.Dispatch<React.SetStateAction<Card | null>> }) => {
  const { handleSubmit, register } = useForm();
  const { showMessage } = useMessages();

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/cards/${data.cardNumber}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      });

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
        if (error?.response?.data?.statusCode === 404) showMessage(ErrorMessage.CARD_NOT_FOUND, 'error');
        if (error?.response?.data?.statusCode === 500) showMessage(ErrorMessage.INTERNAL_SERVER_ERROR, 'error');
      } else {
        showMessage('An unexpected error occurred', 'error');
        console.error(error);
      }
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
    </>
  );
};

export default SearchCard;
