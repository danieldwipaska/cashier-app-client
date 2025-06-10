import { useRef } from 'react';
import jsPDF from 'jspdf';
import bahariLogo from '../../assets/img/bahari-logo.webp';
import { ReactComponent as DownloadIcon } from '../../assets/img/icons/download.svg';
import { ReportType } from 'configs/utils';
import { Item } from 'context/slices/orderSlice';

const Invoices = ({ selectedPaymentData, totalPaymentSelectedData }: any) => {
  const useReff = useRef<HTMLDivElement>(null);

  const generatePDF = () => {
    if (useReff.current) {
      const doc = new jsPDF('p', 'mm', [58, 150]);
      doc.html(useReff.current, {
        callback: function (doc) {
          doc.save('document.pdf');
        },
        x: 2,
        y: 2,
      });
    }
  };

  const handleClickButton = async () => {
    try {
      await fetch('http://localhost:3003/print');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div className="hidden">
        <div ref={useReff} style={{ width: '14mm', fontSize: '3px' }}>
          <div id="parent-modal-title" className="flex flex-col items-center w-full" style={{ fontSize: '3px' }}>
            <img src={bahariLogo} alt="bahari" className=" w-[20px]" style={{ marginBottom: '-5px' }} />
            <div className="font-bold">Bahari Irish Pub</div>
            <div>Jl. Kawi No.8A, Kota Malang</div>
            <div>Indonesia, 65119</div>
          </div>
          <div
            className="w-full mt-1"
            style={{
              height: '1px',
              backgroundColor: 'black',
              transform: 'scaleY(0.2)',
              transformOrigin: '0 0',
            }}
          ></div>
          <div className="mb-1">
            <div className="flex justify-between">
              <div>Date, Time</div>
              <div>
                {selectedPaymentData ? selectedPaymentData.dateCreatedAt : null}, {selectedPaymentData ? selectedPaymentData.timeCreatedAt : null}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>Number</div>
              <div className="">{selectedPaymentData ? selectedPaymentData.report_id : null}</div>
            </div>
            <div className="flex justify-between">
              <div>Collected</div>
              <div>{selectedPaymentData ? selectedPaymentData.served_by : null}</div>
            </div>
            <div className="flex justify-between">
              <div>Customer</div>
              <div>{selectedPaymentData ? selectedPaymentData.customer_name : null}</div>
            </div>
          </div>

          <div className=" mb-1">
            {selectedPaymentData?.items?.map((item: Item, i: number) => (
              <div key={i} className="flex justify-between">
                <div className="flex">
                  <div>{item.fnb_name}</div>
                  <div>...x {item.amount}</div>
                </div>
                <div>IDR {Intl.NumberFormat('en-us').format(item.price * item.amount)}</div>
              </div>
            ))}
            {selectedPaymentData?.type !== ReportType.PAY ? (
              <div className="flex justify-between">
                <div>{selectedPaymentData?.type}</div>
                <div>IDR {Intl.NumberFormat('en-us').format(selectedPaymentData?.total_payment_after_tax_service)}</div>
              </div>
            ) : null}
          </div>

          {selectedPaymentData?.type !== ReportType.PAY ? null : (
            <div className=" mb-1">
              <div className="flex justify-between">
                <div>Subtotal</div>
                <div>IDR {Intl.NumberFormat('en-us').format(selectedPaymentData?.total_payment)}</div>
              </div>
              <div className="flex justify-between">
                <div>Service - included</div>
                <div></div>
              </div>
              <div className="flex justify-between">
                <div>Tax (PB1) - included</div>
                <div></div>
              </div>
            </div>
          )}

          <div className=" font-bold">
            <div className="flex justify-between">
              <div>
                <div>Total</div>
              </div>
              <div>
                <div>IDR {Intl.NumberFormat('en-us').format(totalPaymentSelectedData ? totalPaymentSelectedData : 0)}</div>
              </div>
            </div>
          </div>

          <div className=" mb-1">
            <div className="flex justify-between">
              <div>{selectedPaymentData?.payment_method}</div>
              <div>IDR {Intl.NumberFormat('en-us').format(totalPaymentSelectedData ? totalPaymentSelectedData : 0)}</div>
            </div>
          </div>

          <div className=" mb-1">
            <div>Note:</div>
            <div>{selectedPaymentData ? selectedPaymentData.note : null}</div>
          </div>
        </div>
      </div>

      <button onClick={handleClickButton}>
        <DownloadIcon className="w-[30px]" />
      </button>
    </div>
  );
};

export default Invoices;
