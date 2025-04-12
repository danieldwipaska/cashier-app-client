import axios from 'axios';
import { ChildModal, NestedModal } from 'components/modals/Modal';
import { CardAction, ErrorMessage } from 'configs/utils';
import { Card } from 'lib/interfaces/cards';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import formatNumber from 'functions/format.number';
import { useMessages } from 'context/MessageContext';

const Topup = ({ data, openTopupModal, handleCloseTopupModal, refetchCardData, setOpenBackdrop }: { data: Card; openTopupModal: any; handleCloseTopupModal: any; refetchCardData: any; setOpenBackdrop: any }) => {
  const { showMessage } = useMessages();

  const { handleSubmit } = useForm();
  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [addBalance, setAddBalance] = useState(0);
  const [formattedAddBalance, setFormattedAddBalance] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState('');
  const [note, setNote] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<any>(null);

  const handleChangeCustomerName = (event: any) => {
    setCustomerName(event.target.value);
  };
  const handleChangeCustomerId = (event: any) => {
    setCustomerId(event.target.value);
  };
  const handleChangeAddBalance = (event: any) => {
    const input = event.target.value;
    const rawNumber = input.replace(/\./g, "");

    setFormattedAddBalance(formatNumber(rawNumber));
    setAddBalance(Number(rawNumber)); 
  };
  const handleChangePaymentMethod = (event: any) => {
    setPaymentMethod(event.target.value);
  };
  const handleChangeNote = (event: any) => {
    setNote(event.target.value);
  };
  const handleChangeCode = (event: any) => {
    setCode(event.target.value);
  };

  const onSubmit = async () => {
    if (data.status === 'active') {
      const formData = {
        addBalance,
        paymentMethod,
        note,
        crewCode: code,
      };

      try {
        const response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/cards/${data?.id}/topup`, formData);

        handleCloseTopupModal();
        refetchCardData(response.data.data.card_number);
        resetTopupData();

        setOpenBackdrop(true);
        setTimeout(() => {
          setOpenBackdrop(false);
        }, 3000);
      } catch (error: any) {
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
    } else if (data.status === 'inactive') {
      const formData = {
        customerName,
        customerId,
        addBalance,
        paymentMethod,
        note,
        crewCode: code,
      };

      try {
        const response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/cards/${data?.id}/topup/activate`, formData);

        handleCloseTopupModal();
        refetchCardData(response.data.data.card_number);
        resetTopupData();
      } catch (error) {
        console.log(error);
        showMessage(ErrorMessage.INTERNAL_SERVER_ERROR, 'error');
      }
    }
  };

  const resetTopupData = () => {
    setCustomerName('');
    setCustomerId('');
    setAddBalance(0);
    setPaymentMethod('');
    setNote('');
    setCode('');
    setError(null);
  };

  return (
    <>
      <NestedModal open={openTopupModal} handleClose={handleCloseTopupModal}>
        <div className="top-up-wrapper">
          <h1 className="text-lg font-semibold mb-5">Top-up</h1>
          {data?.status === 'inactive' && (
            <div className="grid grid-cols-2 items-center mb-4">
              <label className="" htmlFor="customerName">
                Name
              </label>
              <input type="text" className="border px-3 py-2" id="customerName" value={customerName} onChange={handleChangeCustomerName} placeholder="ex. John Doe" required />
              <div></div>
              {error && <p className="text-red-500 text-xs">{error.customerName}</p>}
            </div>
          )}
          {data?.status === 'inactive' && (
            <div className="grid grid-cols-2 items-center mb-4">
              <label className="" htmlFor="customerId">
                Phone
              </label>
              <input type="text" className="border px-3 py-2" id="customerId" value={customerId} onChange={handleChangeCustomerId} placeholder="ex. 08111111111" required />
              <div></div>
              {error && <p className="text-red-500 text-xs">{error.customerId}</p>}
            </div>
          )}
          <div className="grid grid-cols-2 items-center mb-4">
            <label className="" htmlFor="addBalance">
              Amount
            </label>
            <input type="text" className="border px-3 py-2" id="addBalance" value={formattedAddBalance} onChange={handleChangeAddBalance} placeholder="ex. 100.000" required />
            <div></div>
            {error && <p className="text-red-500 text-xs">{error.addBalance}</p>}
          </div>
          <div className="grid grid-cols-2 items-center mb-4">
            <label className="" htmlFor="paymentMethod">
              Payment Method
            </label>
            <select value={paymentMethod} onChange={handleChangePaymentMethod} id="paymentMethod" className="border px-3 py-2" required>
              <option value="">------</option>
              <option value="cash">Cash</option>
              <option value="EDC BCA">EDC BCA</option>
              <option value="EDC Mandiri">EDC Mandiri</option>
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
        <ChildModal setError={setError} data={{ addBalance, paymentMethod, note }} action={CardAction.TOPUP}>
          <h1 className="text-lg font-semibold mb-5">Confirmation</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" value={data?.id} />
            <div className="grid grid-cols-2 items-center mb-4">
              <label className="" htmlFor="customerName">
                Name
              </label>
              <input type="text" className="border px-3 py-2 bg-gray-300" id="customerName" value={data?.status === 'inactive' ? customerName : data.customerName} placeholder="ex. 100000" required readOnly />
            </div>
            <div className="grid grid-cols-2 items-center mb-4">
              <label className="" htmlFor="customerId">
                Phone
              </label>
              <input type="text" className="border px-3 py-2 bg-gray-300" id="customerId" value={data?.status === 'inactive' ? customerId : data.customerId} placeholder="ex. 100000" required readOnly />
            </div>
            <div className="grid grid-cols-2 items-center mb-4">
              <label className="" htmlFor="addBalance">
                Amount
              </label>
              <input type="text" className="border px-3 py-2 bg-gray-300" id="addBalance" value={formattedAddBalance} required readOnly />
            </div>
            <div className="grid grid-cols-2 items-center mb-4">
              <label className="" htmlFor="amount">
                Payment Method
              </label>
              <input type="text" className="border px-3 py-2 bg-gray-300" id="paymentMethod" value={paymentMethod} required readOnly />
            </div>
            {note ? (
              <div className="grid grid-cols-2 items-center mb-4">
                <label className="" htmlFor="note">
                  Note
                </label>
                <textarea className="border px-3 py-2 bg-gray-300" id="note" required readOnly />
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

export default Topup;
