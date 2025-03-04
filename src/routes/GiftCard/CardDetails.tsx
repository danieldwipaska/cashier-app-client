import { ReactComponent as AccountIcon } from '../../assets/img/icons/account.svg';
import { ReactComponent as AccountPlusIcon } from '../../assets/img/icons/account-plus.svg';
import { ReactComponent as ArrowUpRightIcon } from '../../assets/img/icons/arrow-up-right.svg';
import { ReactComponent as ArrowRightLeftIcon } from '../../assets/img/icons/arrow-right-left.svg';
import { ReactComponent as CheckoutIcon } from '../../assets/img/icons/checkout.svg';
import { ReactComponent as CartIcon } from '../../assets/img/icons/cart.svg';
import { ReactComponent as ReceiptRefundIcon } from '../../assets/img/icons/receipt-refund.svg';
import { Card } from 'lib/interfaces/cards';
import Topup from 'components/GiftCard/Topup';
import { useState } from 'react';
import Adjust from 'components/GiftCard/Adjust';
import Checkout from 'components/GiftCard/Checkout';
import { ReportType } from 'configs/utils';
import { Backdrop } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

const CardDetails = ({ cardData, setCardData, refetchCardData, customerReports }: { cardData: Card; setCardData: any; refetchCardData: any; customerReports: any }) => {
  const [openTopupModal, setOpenTopupModal] = useState(false);
  const [openAdjustModal, setOpenAdjustModal] = useState(false);
  const [openCheckoutModal, setOpenCheckoutModal] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const handleOpenTopupModal = () => {
    setOpenTopupModal(true);
  };
  const handleCloseTopupModal = () => {
    setOpenTopupModal(false);
  };
  const handleOpenAdjustModal = () => {
    setOpenAdjustModal(true);
  };
  const handleCloseAdjustModal = () => {
    setOpenAdjustModal(false);
  };
  const handleOpenCheckoutModal = () => {
    setOpenCheckoutModal(true);
  };
  const handleCloseCheckoutModal = () => {
    setOpenCheckoutModal(false);
  };

  return (
    <div className="w-full bg-white h-full p-10 grid grid-cols-2 gap-4">
      <div className="flex flex-col justify-between">
        <div>
          <div className="mb-5">
            <p className="font-poppins font-semibold">Bahari Card - Details</p>
          </div>
          <div className="flex gap-8 mb-4">
            <div>
              <AccountIcon className='w-20 text-gray-500' />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl text-gray-600">Rp. {Intl.NumberFormat('id-ID').format(cardData?.balance)},-</h1>
            </div>
          </div>
          <div className="action-wrapper flex gap-3 mb-10">
            {cardData?.status === 'active' ? (
              <>
                <button className="px-4 py-1 rounded-full flex items-center justify-center gap-1 hover:scale-105 bg-green-400 duration-200" onClick={handleOpenTopupModal}>
                  <span>Top-up</span>
                  <ArrowUpRightIcon className='w-[15px]' />
                </button>
                <button className="px-4 py-1 rounded-full flex items-center justify-center gap-1 hover:scale-105 hover:bg-gray-400 border border-gray-400 duration-200" onClick={handleOpenAdjustModal}>
                  <span>Adjust</span>
                  <ArrowRightLeftIcon className='w-[15px]' />
                </button>
                <button className="px-4 py-1 rounded-full flex items-center justify-center gap-1 hover:scale-105 bg-red-200 duration-200" onClick={handleOpenCheckoutModal}>
                  <span>Checkout</span>
                  <CheckoutIcon className='w-[15px]' />
                </button>
              </>
            ) : (
              <button className="px-4 py-1 rounded-full flex items-center justify-center gap-1 hover:scale-105 bg-green-200 hover:bg-green-400 duration-200" onClick={handleOpenTopupModal}>
                <span>Activate</span>
                <AccountPlusIcon className='w-[20px]' />
              </button>
            )}
          </div>
          <Topup data={cardData} openTopupModal={openTopupModal} handleCloseTopupModal={handleCloseTopupModal} refetchCardData={refetchCardData} setOpenBackdrop={setOpenBackdrop} />
          <Adjust data={cardData} openAdjustModal={openAdjustModal} handleCloseAdjustModal={handleCloseAdjustModal} refetchCardData={refetchCardData} setOpenBackdrop={setOpenBackdrop} />
          <Checkout data={cardData} openCheckoutModal={openCheckoutModal} handleCloseCheckoutModal={handleCloseCheckoutModal} refetchCardData={refetchCardData} setOpenBackdrop={setOpenBackdrop} />
          <table className="mb-10">
            <tbody>
              <tr>
                <td className="min-w-32">Card Number</td>
                <td>:&nbsp;&nbsp;&nbsp;</td>
                <td>{cardData?.cardNumber}</td>
              </tr>
            </tbody>
          </table>
          <table>
            <tbody>
              <tr>
                <td className="min-w-32">Name</td>
                <td>:&nbsp;&nbsp;&nbsp;</td>
                <td>{cardData?.customerName ? cardData?.customerName : '-'}</td>
              </tr>
              <tr>
                <td className="min-w-32">Phone</td>
                <td>:&nbsp;&nbsp;&nbsp;</td>
                <td>{cardData?.customerId ? cardData?.customerId : '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <button
            className="px-4 py-2 bg-gray-300 rounded-md"
            onClick={() => {
              setCardData(null);
            }}
          >
            Back to search
          </button>
        </div>
      </div>
      <div>
        <div className="mb-5">
          <p className="font-poppins font-semibold">Activity History - {customerReports && `(${customerReports.length})`}</p>
        </div>
        <div className="transaction-container xl:max-h-[400px] 2xl:max-h-[450px] overflow-y-auto">
          {customerReports &&
            customerReports.map((report: any, index: number) => {
              return (
                <div key={report.id} className="transaction p-3 w-full flex items-center gap-4 border-b-2">
                  <div className="transaction-image">
                    {report.type === ReportType.TOPUP && <ArrowUpRightIcon className='w-[40px] text-green-600' />}
                    {report.type === ReportType.ADJUSTMENT && <ArrowRightLeftIcon className='w-[40px] text-gray-600' />}
                    {report.type === ReportType.CHECKOUT && <CheckoutIcon className='w-[40px] text-red-600' />}
                    {report.type === ReportType.PAY && <CartIcon className='w-[40px] text-[#fced77]' />}
                    {report.type === ReportType.TOPUP_AND_ACTIVATE && <AccountPlusIcon className='w-[40px] text-green-600' />}
                    {report.type === ReportType.REFUND && <ReceiptRefundIcon className='w[40px] text-gray-500' />}
                  </div>
                  <div className="transaction-content w-full">
                    <div className="flex justify-between">
                      <p className="font-semibold">{report.type}</p>
                      <p className="text-xl font-semibold">
                        {report.total_payment_after_tax_service < 0 && '-'} Rp. {Intl.NumberFormat('id-ID').format(Math.abs(report.total_payment_after_tax_service))},-
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-500 text-sm">
                        {new Date(report.created_at).toLocaleDateString()} - {new Date(report.created_at).toLocaleTimeString()}
                      </p>
                      <p className="text-gray-500 text-sm">Rp. {Intl.NumberFormat('id-ID').format(Math.abs(report.final_balance))},-</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <Backdrop sx={{ color: '#fff', bgcolor: 'rgb(59,164,112,0.7)', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openBackdrop} transitionDuration={300}>
        <CheckCircle color="inherit" fontSize="large" />
      </Backdrop>
    </div>
  );
};

export default CardDetails;
