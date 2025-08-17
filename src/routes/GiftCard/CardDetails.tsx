import { ReactComponent as AccountIcon } from '../../assets/img/icons/account.svg';
import { ReactComponent as AccountPlusIcon } from '../../assets/img/icons/account-plus.svg';
import { ReactComponent as ArrowUpRightIcon } from '../../assets/img/icons/arrow-up-right.svg';
import { ReactComponent as ArrowRightLeftIcon } from '../../assets/img/icons/arrow-right-left.svg';
import { ReactComponent as CheckoutIcon } from '../../assets/img/icons/checkout.svg';
import { ReactComponent as CartIcon } from '../../assets/img/icons/cart.svg';
import { Card } from 'lib/interfaces/cards';
import Topup from 'components/GiftCard/Topup';
import { useEffect, useState } from 'react';
import Adjust from 'components/GiftCard/Adjust';
import Checkout from 'components/GiftCard/Checkout';
import { CardStatus, ReportStatus, ReportType } from 'configs/utils';
import { Backdrop, CircularProgress } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { NestedModal } from 'components/modals/Modal';
import Invoices from 'components/PaymentHistory/Invoices';

const CardDetails = ({ cardData, setCardData, refetchCardData, customerReports }: { cardData: Card; setCardData: any; refetchCardData: any; customerReports: any }) => {
  const [openTopupModal, setOpenTopupModal] = useState(false);
  const [openAdjustModal, setOpenAdjustModal] = useState(false);
  const [openCheckoutModal, setOpenCheckoutModal] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  // Receipt
  const [openReceiptModal, setReceiptModal] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState<boolean>(false);

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
  const handleCloseDetailModal = () => {
    setReceiptModal(false);
    setPaymentData(null);
  };

  useEffect(() => {
    setDataLoading(customerReports ? false : true);
  }, [customerReports]);

  return (
    <div className="w-full bg-white h-full p-10 grid grid-cols-2 gap-4">
      <div className="flex flex-col justify-between">
        <div>
          <div className="mb-5">
            <p className="font-poppins font-semibold">Bahari Card - Details</p>
          </div>
          <div className="flex gap-8 mb-4">
            <div>
              <AccountIcon className="w-20 text-gray-500" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl text-gray-600">Rp. {Intl.NumberFormat('id-ID').format(cardData?.balance)},-</h1>
            </div>
          </div>
          <div className="action-wrapper flex gap-3 mb-10">
            {cardData?.status === CardStatus.ACTIVE ? (
              <>
                <button className="px-4 py-1 rounded-full flex items-center justify-center gap-1 hover:scale-105 bg-green-400 duration-200" onClick={handleOpenTopupModal}>
                  <span>Top-up</span>
                  <ArrowUpRightIcon className="w-[15px]" />
                </button>
                <button className="px-4 py-1 rounded-full flex items-center justify-center gap-1 hover:scale-105 hover:bg-gray-400 border border-gray-400 duration-200" onClick={handleOpenAdjustModal}>
                  <span>Adjust</span>
                  <ArrowRightLeftIcon className="w-[15px]" />
                </button>
                <button className="px-4 py-1 rounded-full flex items-center justify-center gap-1 hover:scale-105 bg-red-200 duration-200" onClick={handleOpenCheckoutModal}>
                  <span>Checkout</span>
                  <CheckoutIcon className="w-[15px]" />
                </button>
              </>
            ) : (
              <button className="px-4 py-1 rounded-full flex items-center justify-center gap-1 hover:scale-105 bg-green-200 hover:bg-green-400 duration-200" onClick={handleOpenTopupModal}>
                <span>Activate</span>
                <AccountPlusIcon className="w-[20px]" />
              </button>
            )}
          </div>
          <Topup
            data={cardData}
            openTopupModal={openTopupModal}
            handleCloseTopupModal={handleCloseTopupModal}
            refetchCardData={refetchCardData}
            setOpenBackdrop={setOpenBackdrop}
            setPaymentData={setPaymentData}
            setReceiptModal={setReceiptModal}
          />
          <Adjust data={cardData} openAdjustModal={openAdjustModal} handleCloseAdjustModal={handleCloseAdjustModal} refetchCardData={refetchCardData} setOpenBackdrop={setOpenBackdrop} />
          <Checkout
            data={cardData}
            openCheckoutModal={openCheckoutModal}
            handleCloseCheckoutModal={handleCloseCheckoutModal}
            refetchCardData={refetchCardData}
            setOpenBackdrop={setOpenBackdrop}
            setPaymentData={setPaymentData}
            setReceiptModal={setReceiptModal}
          />
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
        {dataLoading ? (
          <div className="flex items-center gap-2">
            <p>Loading</p>
            <CircularProgress color="warning" size={15} />
          </div>
        ) : (
          <div className="transaction-container max-h-[calc(100dvh-220px)] overflow-y-auto">
            {customerReports &&
              customerReports.map((report: any, index: number) => {
                return (
                  <div key={report.id} className="transaction p-3 w-full flex items-center gap-4 border-b-2">
                    <div className="transaction-image">
                      {report.type === ReportType.TOPUP && <ArrowUpRightIcon className="w-[40px] text-green-600" />}
                      {report.type === ReportType.ADJUSTMENT && <ArrowRightLeftIcon className="w-[40px] text-gray-600" />}
                      {report.type === ReportType.CHECKOUT && <CheckoutIcon className="w-[40px] text-red-600" />}
                      {report.type === ReportType.PAY && <CartIcon className="w-[40px] text-[#fced77]" />}
                      {report.type === ReportType.TOPUP_AND_ACTIVATE && <AccountPlusIcon className="w-[40px] text-green-600" />}
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
        )}
      </div>

      <NestedModal open={openReceiptModal} handleClose={handleCloseDetailModal} divClass={`overflow-y-auto max-h-screen`}>
        <div className=" relative">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold mt-5">Bahari Irish Pub</h1>
            <p>Jl. Kawi No.8A, Kota Malang</p>
            <p>Indonesia, 65119</p>
            <div className="my-3 w-full border border-b-black border-dashed"></div>
            <p>{paymentData?.report_id}</p>
            <div className="my-3 w-full border border-b-black border-dashed"></div>
          </div>
          <div className="flex justify-between">
            <p>{new Date(paymentData?.updated_at).toLocaleDateString()}</p>
            <p>{new Date(paymentData?.updated_at).toLocaleTimeString()}</p>
          </div>
          <div className="flex justify-between">
            <p>Served by</p>
            <p>{paymentData?.crew?.name}</p>
          </div>
          <div className="flex justify-between">
            <p>Customer Name</p>
            <p>{paymentData?.customer_name}</p>
          </div>
          <div className="my-3 w-full border border-b-black border-dashed"></div>
          <div>
            {paymentData?.type !== ReportType.PAY ? (
              <div className="flex justify-between">
                <div>{paymentData?.type}</div>
                <div>{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(paymentData?.total_payment_after_tax_service)}</div>
              </div>
            ) : null}

            <div className="my-3 w-full border border-b-black border-dashed"></div>

            {paymentData?.type !== ReportType.PAY ? null : (
              <div className=" mb-1">
                <div className="flex justify-between">
                  <div>Subtotal</div>
                  <div>{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(paymentData?.total_payment)}</div>
                </div>
                <div className="flex justify-between">
                  <div>Service {paymentData?.included_tax_service ? '- included' : ''}</div>
                  <div></div>
                </div>
                <div className="flex justify-between">
                  <div>Tax (PB1) {paymentData?.included_tax_service ? '- included' : ''}</div>
                  <div></div>
                </div>
              </div>
            )}

            <div className=" font-bold mt-3">
              <div className="flex justify-between">
                <div>
                  <div>Total</div>
                </div>
                <div>
                  <div>{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(paymentData?.total_payment_after_tax_service)}</div>
                </div>
              </div>
            </div>

            <div className="my-3 w-full border border-b-black border-dashed"></div>

            <div>
              <div>Note:</div>
              <div>{paymentData ? paymentData.note : null}</div>
            </div>
          </div>
          <div className="flex justify-end">
            <Invoices selectedPaymentData={paymentData} />
          </div>

          {paymentData?.status === ReportStatus.PAID ? (
            <div className="absolute top-4 right-0">
              <CheckCircle sx={{ fontSize: 40 }} color="success" />
            </div>
          ) : (
            <div className="absolute top-2 right-0 p-2 font-semibold text-sm text-red-500">{paymentData?.status}</div>
          )}
        </div>
      </NestedModal>

      <Backdrop sx={{ color: '#fff', bgcolor: 'rgb(59,164,112,0.7)', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openBackdrop} transitionDuration={300}>
        <CheckCircle color="inherit" fontSize="large" />
      </Backdrop>
    </div>
  );
};

export default CardDetails;
