import React, { useRef } from 'react';
import jsPDF from 'jspdf';

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

  return (
    <div>
      <div className="hidden">
        <div ref={useReff} style={{ width: '14mm', fontSize: '3px' }}>
          <div id="parent-modal-title" className="text-center  font-bold" style={{ fontSize: '4px' }}>
            Receipt
          </div>
          <div className="text-center border-b">Bahari Irish Pub</div>
          <div className=" mb-1">
            <div className="flex justify-between">
              <div>Date, Time</div>
              <div>
                {selectedPaymentData ? new Date(selectedPaymentData.created_at).toLocaleDateString() : null}, {selectedPaymentData ? new Date(selectedPaymentData.created_at).toLocaleTimeString() : null}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>Number</div>
              <div className="">{selectedPaymentData ? selectedPaymentData.report_id : null}</div>
            </div>
            <div className="flex justify-between">
              <div>Collected</div>
              <div>{selectedPaymentData ? selectedPaymentData.collected_by : null}</div>
            </div>
            <div className="flex justify-between">
              <div>Customer</div>
              <div>{selectedPaymentData ? selectedPaymentData.customer_name : null}</div>
            </div>
          </div>

          <div className=" mb-1">
            {selectedPaymentData?.order_name.map((order: any, i: number) => (
              <div className="flex justify-between">
                <div className="flex">
                  <div>{order}</div>
                  <div>...x {selectedPaymentData.order_amount[i]}</div>
                </div>
                <div>IDR {Intl.NumberFormat('en-us').format(selectedPaymentData.order_price[i] * selectedPaymentData.order_amount[i])}</div>
              </div>
            ))}
            {selectedPaymentData?.type !== 'pay' ? (
              <div className="flex justify-between">
                <div>{selectedPaymentData?.type}</div>
                <div>IDR {Intl.NumberFormat('en-us').format(selectedPaymentData?.total_payment)}</div>
              </div>
            ) : null}
          </div>

          {selectedPaymentData?.type !== 'pay' ? null : (
            <div className=" mb-1">
              <div className="flex justify-between">
                <div>Subtotal</div>
                <div>IDR {Intl.NumberFormat('en-us').format(totalPaymentSelectedData ? totalPaymentSelectedData : 0)}</div>
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

      <button onClick={generatePDF}>Generate PDF</button>
    </div>
  );
};

export default Invoices;
