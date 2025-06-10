import { ReactComponent as DownloadIcon } from '../../assets/img/icons/download.svg';
import axios from 'axios';

const Invoices = ({ selectedPaymentData }: any) => {
  const handleClickButton = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_API_BASE_URL}/reports/${selectedPaymentData.id}/print`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button onClick={handleClickButton}>
        <DownloadIcon className="w-[30px]" />
      </button>
    </div>
  );
};

export default Invoices;
