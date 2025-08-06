import { ErrorMessage, ReportType } from 'configs/utils';
import { ReactComponent as PrintIcon } from '../../assets/img/icons/print.svg';
import axios from 'axios';
import { useMessages } from 'context/MessageContext';

const Invoices = ({ selectedPaymentData }: any) => {
  const { showMessage } = useMessages();

  const handlePrintReceipt = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_API_BASE_URL}/reports/${selectedPaymentData.id}/print`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      });
    } catch (error: any) {
      if (error?.response?.data?.statusCode === 500) return showMessage(ErrorMessage.INTERNAL_SERVER_ERROR, 'error');
      if (error?.response?.data?.statusCode === 400) return showMessage(ErrorMessage.BAD_REQUEST, 'error');
      return showMessage(ErrorMessage.UNEXPECTED_ERROR, 'error');
    }
  };

  const handlePrintChecker = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_API_BASE_URL}/reports/${selectedPaymentData.id}/print?is_checker=true`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      });
    } catch (error: any) {
      if (error?.response?.data?.statusCode === 500) return showMessage(ErrorMessage.INTERNAL_SERVER_ERROR, 'error');
      if (error?.response?.data?.statusCode === 400) return showMessage(ErrorMessage.BAD_REQUEST, 'error');
      return showMessage(ErrorMessage.UNEXPECTED_ERROR, 'error');
    }
  };

  return (
    <div className="flex gap-3 items-center">
      {selectedPaymentData?.type === ReportType.PAY ? (
        <button onClick={handlePrintChecker}>
          <div className="flex gap-1 items-center bg-slate-300 rounded-full py-3 px-3">
            <PrintIcon className="w-[25px]" />
            <span>Checker</span>
          </div>
        </button>
      ) : null}
      <button onClick={handlePrintReceipt}>
        <div className="flex gap-1 items-center bg-green-300 rounded-full py-2 px-4">
          <PrintIcon className="w-[30px]" />
        </div>
      </button>
    </div>
  );
};

export default Invoices;
