import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export const AnotherExample = () => {
  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    documentTitle: 'Print This Document',
    onBeforePrint: () => console.log('before printing...'),
    onAfterPrint: () => console.log('after printing...'),
    removeAfterPrint: true,
  });

  return (
    <>
      <div ref={contentToPrint}>
        <h1 id="parent-modal-title" className="text-center font-serif mb-10">
          Bill Details
        </h1>

        <div className="font-serif border-t mb-4">
          <div className="flex justify-between">
            <div>Date, Time</div>
            <div></div>
          </div>
          {/* <div className="flex justify-between items-center">
                <div>Receipt Number</div>
                <div className="text-xs">{selectedPaymentData ? selectedPaymentData.id : null}</div>
              </div> */}
          <div className="flex justify-between">
            <div>Collected By</div>
            <div></div>
          </div>
          <div className="flex justify-between">
            <div>Customer</div>
            <div></div>
          </div>
        </div>

        <div className="font-serif border-t mb-4">
          <div className="flex justify-between">
            <div className="flex">
              <div></div>
              <div className="mx-2">x </div>
            </div>
            <div></div>
          </div>

          <div className="flex justify-between">
            <div></div>
            <div></div>
          </div>
        </div>

        <div className="font-serif border-t mb-6 text-sm">
          <div className="flex justify-between">
            <div>Subtotal</div>
            <div></div>
          </div>
          <div className="flex justify-between">
            <div>Service</div>
            <div></div>
          </div>
          <div className="flex justify-between">
            <div>PB1</div>
            <div></div>
          </div>
        </div>

        <div className="font-serif font-bold border-t py-4">
          <div className="flex justify-between">
            <div>
              <h4>Total</h4>
            </div>
            <div>
              <h4></h4>
            </div>
          </div>
        </div>

        <div className="font-serif border-t pt-2 mb-2">
          <div className="flex justify-between">
            <div></div>
            <div></div>
          </div>
        </div>

        <div className="font-serif pt-2 text-xs">
          <div>Note:</div>
          <div></div>
        </div>
        <div className="font-serif pt-6 flex justify-center"></div>
      </div>
    </>
  );
};
