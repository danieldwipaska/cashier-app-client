import axios from 'axios';
import { ChildModal, NestedModal } from 'components/modals/Modal';
import { CardAction, ErrorMessage } from 'configs/utils';
import { Card } from 'lib/interfaces/cards';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMessages } from 'context/MessageContext';
import { useQuery } from '@tanstack/react-query';

const Checkout = ({ data, openCheckoutModal, handleCloseCheckoutModal, refetchCardData, setOpenBackdrop }: { data: Card; openCheckoutModal: any; handleCloseCheckoutModal: any; refetchCardData: any; setOpenBackdrop: any }) => {
  // START HOOKS
  const { showMessage } = useMessages();
  // END HOOKS

  const { handleSubmit } = useForm();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [note, setNote] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<any>(null);

  const handleChangePaymentMethod = (event: any) => {
    setPaymentMethod(event.target.value);
  };
  const handleChangeNote = (event: any) => {
    setNote(event.target.value);
  };
  const handleChangeCode = (event: any) => {
    setCode(event.target.value);
  };

  const { data: methods } = useQuery({
    queryKey: ['cardMethods'],
    queryFn: async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/methods`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        });
        const method_data = res.data.data.filter((method: any) => method.id !== process.env.REACT_APP_GIFT_CARD_METHOD_ID);

        return method_data; 
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  });

  const onSubmit = async () => {
    const formData = {
      paymentMethod,
      note,
      crewCode: code,
    };

    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/cards/${data?.id}/checkout`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      });

      handleCloseCheckoutModal();
      refetchCardData(response.data.data.card_number);
      resetCheckoutData();

      setOpenBackdrop(true);
      setTimeout(() => {
        setOpenBackdrop(false);
      }, 3000);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error?.response?.data?.statusCode === 404) showMessage(ErrorMessage.CARD_NOT_FOUND, 'error');
        if (error?.response?.data?.statusCode === 500) showMessage(ErrorMessage.INTERNAL_SERVER_ERROR, 'error');
        if (error?.response?.data?.statusCode === 400) showMessage(ErrorMessage.BAD_REQUEST, 'error');
        if (error?.response?.data?.statusCode === 401) showMessage(ErrorMessage.INVALID_CREW_CODE, 'error');
      } else {
        showMessage(ErrorMessage.UNEXPECTED_ERROR, 'error');
      }
    }
  };

  const resetCheckoutData = () => {
    setPaymentMethod('');
    setNote('');
    setCode('');
    setError(null);
  };

  return (
    <>
      <NestedModal open={openCheckoutModal} handleClose={handleCloseCheckoutModal}>
        <div className="top-up-wrapper">
          <h1 className="text-lg font-semibold mb-5">Checkout</h1>
          <div className="grid grid-cols-2 items-center mb-4">
            <label className="" htmlFor="paymentMethod">
              Payment Method
            </label>
            <select value={paymentMethod} onChange={handleChangePaymentMethod} id="paymentMethod" className="border px-3 py-2" required>
              <option value="">------</option>
              {methods?.map((method: any) => {
                return (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                );
              })}
            </select>
            <div></div>
            {error && <p className="text-red-500 text-xs">{error.paymentMethod}</p>}
          </div>
          <div className="grid grid-cols-2 items-center mb-4">
            <label className="" htmlFor="note">
              Note
            </label>
            <input type="text" className="border px-3 py-2" id="note" value={note} onChange={handleChangeNote} placeholder="ex. udah langganan" />
            <div></div>
            {error && <p className="text-red-500 text-xs">{error.note}</p>}
          </div>
        </div>
        <ChildModal setError={setError} data={{ paymentMethod, note }} action={CardAction.CHECKOUT}>
          <h1 className="text-lg font-semibold mb-5">Confirmation</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            {data?.customerId ? (
              <>
                <input type="hidden" value={data?.id} />
                <div className="grid grid-cols-2 items-center mb-4">
                  <label className="" htmlFor="customerName">
                    Name
                  </label>
                  <input type="text" className="border px-3 py-2 bg-gray-300" id="customerName" value={data?.customerName} placeholder="ex. 100000" required readOnly />
                </div>
                <div className="grid grid-cols-2 items-center mb-4">
                  <label className="" htmlFor="customerId">
                    Phone
                  </label>
                  <input type="text" className="border px-3 py-2 bg-gray-300" id="customerId" value={data?.customerId} placeholder="ex. 100000" required readOnly />
                </div>
              </>
            ) : null}
            <div className="grid grid-cols-2 items-center mb-4">
              <label className="" htmlFor="paymentMethod">
                Payment Method
              </label>
              <input type="text" className="border px-3 py-2 bg-gray-300" id="paymentMethod" value={paymentMethod} required readOnly />
            </div>
            {note ? (
              <div className="grid grid-cols-2 items-center mb-4">
                <label className="" htmlFor="note">
                  Note
                </label>
                <textarea className="border px-3 py-2 bg-gray-300" value={note} id="note" required readOnly />
              </div>
            ) : null}
            <div className="grid grid-cols-2 items-center mb-4">
              <label className="" htmlFor="code">
                Code
              </label>
              <input type="password" className="border px-3 py-2" id="code" value={code} onChange={handleChangeCode} required />
            </div>
            <button type="submit" className="mt-5 px-4 py-2 bg-green-500 hover:bg-green-600">
              Submit
            </button>
          </form>
        </ChildModal>
      </NestedModal>
    </>
  );
};

export default Checkout;
