import axios from 'axios';
import { API_BASE_URL, ErrorMessage } from 'configs/utils';
import { Card } from 'lib/interfaces/cards';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const SearchCard = ({ setCardData }: { setCardData: any }) => {
  const { handleSubmit, register } = useForm();
  const [error, setError] = useState<any>(null);

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
    } catch (error: any) {
      setError(error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white">
      <div className="flex flex-col gap-4 p-8">
        <div className="flex justify-between items-center">
          <div className="font-semibold text-gray-800">Search Card</div>
          <div className="text-red-500">
            {error?.statusCode === 404 ? ErrorMessage.CARD_NOT_FOUND : null}
            {error?.statusCode === 401 ? error.message : null}
          </div>
        </div>
        <div>
          <input {...register('cardNumber')} type="text" className="px-5 py-2 border" id="cardNumber" placeholder="Enter card number" />
        </div>
        <button className="py-2 bg-green-400">Search</button>
      </div>
    </form>
  );
};

export default SearchCard;
