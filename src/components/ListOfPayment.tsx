import { Box, Button, CircularProgress, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import { CSVLink } from 'react-csv';
import { MdDownload } from 'react-icons/md';
import { RiArrowRightDoubleLine } from 'react-icons/ri';
import { HiOutlineReceiptRefund, HiReceiptRefund } from 'react-icons/hi';
import { ImCancelCircle } from 'react-icons/im';
import { MdOutlineDelete } from 'react-icons/md';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { AnotherExample } from './Example';
import { useReactToPrint } from 'react-to-print';

interface Column {
  id: 'type' | 'status' | 'customer_name' | 'customer_id' | 'served_by' | 'total_payment_after_tax_service' | 'payment_method' | 'orders' | 'dateCreatedAt' | 'timeCreatedAt';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'type', label: 'Type', minWidth: 100 },
  { id: 'status', label: 'Status', minWidth: 100 },
  { id: 'customer_name', label: 'Customer', minWidth: 100 },
  { id: 'customer_id', label: 'Customer ID (Phone)', minWidth: 100 },
  { id: 'served_by', label: 'Served By', minWidth: 50 },
  { id: 'total_payment_after_tax_service', label: 'Total Payment', minWidth: 100, format: (value: number) => Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value) },
  { id: 'payment_method', label: 'Method', minWidth: 50 },
  { id: 'orders', label: 'Orders', minWidth: 180 },
  { id: 'dateCreatedAt', label: 'Date', minWidth: 100 },
  { id: 'timeCreatedAt', label: 'Time', minWidth: 100 },
];

interface Data {
  id: string;
  type: string;
  status: string;
  customer_name: string;
  customer_id: string;
  served_by: string;
  total_payment_after_tax_service: number;
  payment_method: string;
  orders: string;
  dateCreatedAt: string;
  timeCreatedAt: string;
}

function createData(
  id: string,
  type: string,
  status: string,
  customer_name: string,
  customer_id: string,
  served_by: string,
  total_payment_after_tax_service: number,
  payment_method: string,
  orders: string,
  dateCreatedAt: string,
  timeCreatedAt: string
): Data {
  return { id, type, status, customer_name, customer_id, served_by, total_payment_after_tax_service, payment_method, orders, dateCreatedAt, timeCreatedAt };
}

// Modal Style
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

function FullRefundModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      {/* <Button sx={{ border: 1, borderColor: 'red', color: 'white', backgroundColor: 'red', ':hover': { backgroundColor: 'red', color: 'white', opacity: 0.5, transition: 'ease', transitionDuration: '0.8s' } }}>Delete</Button>
                
                      <Button
                        sx={{ border: 1, borderColor: 'orange', color: 'white', backgroundColor: 'orange', ':hover': { backgroundColor: 'orange', color: 'white', opacity: 0.5, transition: 'ease', transitionDuration: '0.8s' }, ml: 1 }}
                        onClick={handleOpen}
                      >
                        Refund
                      </Button> */}

      <div className="mx-1 text-yellow-700">
        <button className=" hover:opacity-30 duration-300 " title="Full Refund">
          <HiReceiptRefund size={50} />
        </button>
      </div>

      <Modal open={open} onClose={handleClose} aria-labelledby="child-modal-title" aria-describedby="child-modal-description">
        <Box sx={{ ...style, width: 300 }}>
          <h4 id="child-modal-title" className="font-semibold">
            Confirmation
          </h4>
          <p id="child-modal-description" className="text-sm">
            Are you sure to refund this payment?
          </p>
          <Button onClick={handleClose}>Confirm</Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

function PartialRefundModal({ selectedPaymentData, reportsRefetch }: any) {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState<any>(null);
  const [orderIds, setOrderIds] = React.useState([]);
  const [amountOfRefunds, setAmountOfRefunds] = React.useState<any>(null);
  const [orderPrice, setOrderPrice] = React.useState([]);
  const [orderDiscountStatus, setOrderDiscountStatus] = React.useState([]);
  const [orderDiscountPercent, setOrderDiscountPercent] = React.useState([]);
  const [refundedOrderAmount, setRefundedOrderAmount] = React.useState([]);
  const [totalPayment, setTotalPayment] = React.useState(0);
  const [totalPaymentAfterTaxService, setTotalPaymentAfterTaxService] = React.useState(0);
  const [taxPercent, setTaxPercent] = React.useState(0);
  const [servicePercent, setServicePercent] = React.useState(0);

  const handleOpen = () => {
    setAmountOfRefunds(new Array(orderIds.length).fill(0));
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setOrderIds(selectedPaymentData?.order_id);
    setOrderPrice(selectedPaymentData?.order_price);
    setOrderDiscountStatus(selectedPaymentData?.order_discount_status);
    setOrderDiscountPercent(selectedPaymentData?.order_discount_percent);
    setRefundedOrderAmount(selectedPaymentData?.refunded_order_amount);
    setTaxPercent(selectedPaymentData?.tax_percent);
    setServicePercent(selectedPaymentData?.service_percent);
    setData(selectedPaymentData);
  });

  useEffect(() => {
    let total = 0;

    amountOfRefunds?.forEach((amount: number, index: number) => {
      if (orderDiscountStatus[index]) {
        total += amount * orderPrice[index] * ((100 - orderDiscountPercent[index]) / 100);
      } else {
        total += amount * orderPrice[index];
      }
    });

    const totalAfterTaxService = total + total * (servicePercent / 100) + (total + total * (servicePercent / 100)) * (taxPercent / 100);

    setTotalPayment(total);
    setTotalPaymentAfterTaxService(totalAfterTaxService);
  }, [amountOfRefunds]);

  // useEffect(() => {
  //   console.log(amountOfRefunds);
  // }, [amountOfRefunds]);

  const increaseAmountOfRefund = (index: number) => {
    setAmountOfRefunds((prevAmounts: any) => {
      const newAmounts = [...prevAmounts];
      if (amountOfRefunds[index] < data?.order_amount[index] - data?.refunded_order_amount[index]) {
        newAmounts[index] += 1;
      }

      return newAmounts;
    });
  };

  const decreaseAmountOfRefund = (index: number) => {
    setAmountOfRefunds((prevAmounts: any) => {
      const newAmounts = [...prevAmounts];
      if (amountOfRefunds[index] > 0) {
        newAmounts[index] -= 1;
      }

      return newAmounts;
    });
  };

  const refundPartially = async () => {
    try {
      await axios.patch(`http://localhost:3001/reports/${data?.id}/refund`, { refunded_order_amount: amountOfRefunds });

      reportsRefetch();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <div className="mr-1 text-yellow-700">
        <button className=" hover:opacity-30 duration-300" title="Partial Refund">
          <HiOutlineReceiptRefund size={50} onClick={handleOpen} />
        </button>
      </div>

      <Modal open={open} onClose={handleClose} aria-labelledby="child-modal-title" aria-describedby="child-modal-description">
        <Box sx={{ ...style, width: 380 }}>
          <h4 id="child-modal-title" className="font-semibold">
            Partial Refund
          </h4>
          <div className="flex flex-col overflow-y-auto mt-2 h-60 2xl:h-96">
            {amountOfRefunds?.map((amount: number, index: number) => (
              <div className="flex items-center mt-5">
                <div>
                  <div className="flex justify-between">
                    <div className="mr-2">
                      <p className="text-sm">{data?.order_name[index]}</p>
                    </div>

                    <div className="">
                      <p className="text-sm">{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data?.order_price[index])}</p>
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <button className=" bg-green-500 hover:opacity-70 duration-500 p-2 rounded-md" onClick={() => decreaseAmountOfRefund(index)}>
                      <FaMinus size={10} color="#000000" />
                    </button>
                    <div className="mx-1">
                      <input type="text" className="text-xs text-center text-black/60 py-1 px-2 rounded-md border border-black/25" value={amountOfRefunds[index]} />
                    </div>
                    <button className=" bg-green-500 hover:opacity-70 duration-500 p-2 rounded-md" onClick={() => increaseAmountOfRefund(index)}>
                      <FaPlus size={10} color="#000000" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="">
            <p className="text-sm">Total: - {Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalPaymentAfterTaxService)}</p>
          </div>
          <div className="flex justify-end mt-3">
            <Button onClick={handleClose} color="error">
              Cancel
            </Button>
            <Button onClick={refundPartially} color="success">
              Confirm
            </Button>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

const ListOfPayment = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [DTPickerFrom, setDTPickerFrom] = React.useState('');
  const [DTPickerTo, setDTPickerTo] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [selectedPaymentData, setSelectedPaymentData] = React.useState<any>(null);
  const [totalPaymentSelectedData, setTotalPaymentSelectedData] = React.useState(0);
  const [totalTaxSelectedData, setTotalTaxSelectedData] = React.useState(0);
  const [totalServiceSelectedData, setTotalServiceSelectedData] = React.useState(0);
  const [totalPaymentAfterTaxServiceSelectedData, setTotalPaymentAfterTaxServiceSelectedData] = React.useState(0);
  const [statusSelectedPaymentData, setStatusSelectedPaymentData] = React.useState('');
  const [reportDataCSV, setReportDataCSV] = React.useState<any>([]);

  const [searchedReport, setSearchedReport] = React.useState('');

  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    documentTitle: 'Print This Document',
    onBeforePrint: () => console.log('before printing...'),
    onAfterPrint: () => console.log('after printing...'),
    removeAfterPrint: true,
  });

  const handleSearchReportChange = (event: any) => {
    setSearchedReport(event.target.value);
    setTimeout(() => {
      reportsRefetch();
    }, 500);
  };

  // Modal Interaction
  const [open, setOpen] = React.useState(false);
  const handleOpen = async (id: string) => {
    try {
      const res = await axios.get(`http://localhost:3001/reports/${id}`);

      // let result: number = 0;

      // res.data.data.order_price.forEach((price: number, i: number) => {
      //   result += price * res.data.data.order_amount[i];
      // });

      setTotalPaymentSelectedData(res.data.data.total_payment);
      setTotalServiceSelectedData((res.data.data.service_percent / 100) * res.data.data.total_payment);
      setTotalTaxSelectedData((res.data.data.total_payment + (res.data.data.service_percent / 100) * res.data.data.total_payment) * (res.data.data.tax_percent / 100));
      setTotalPaymentAfterTaxServiceSelectedData(res.data.data.total_payment_after_tax_service);
      setStatusSelectedPaymentData(res.data.data.status);
      setSelectedPaymentData(res.data.data);

      setOpen(true);
    } catch (error) {
      console.log(error);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const { data: reports, refetch: reportsRefetch } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const rows: Data[] = [];

      try {
        let res = await axios.get(`http://localhost:3001/reports?from=${DTPickerFrom}&to=${DTPickerTo}`);
        if (!res.data) return rows;

        if (searchedReport) {
          res.data.data = res.data.data.filter((report: any) => {
            return report.customer_id.toLowerCase().indexOf(searchedReport.toLowerCase()) !== -1 || report.report_id.toLowerCase().indexOf(searchedReport.toLowerCase()) !== -1;
          });
        }

        res.data.data.forEach((report: any) => {
          let ordersString = '';
          report.order_name.forEach((order: any, i: number) => {
            ordersString += `${order} (${report.order_amount[i]} x ${report.order_price[i]}); `;
          });
          rows.push(
            createData(
              report.id,
              report.type,
              report.status,
              report.customer_name,
              report.customer_id,
              report.served_by,
              report.type === 'pay' || report.type === 'refund' ? report.total_payment_after_tax_service : report.total_payment,
              report.payment_method,
              ordersString,
              new Date(report.updated_at).toLocaleDateString(),
              new Date(report.updated_at).toLocaleTimeString()
            )
          );
        });
        setReportDataCSV(res.data.data);

        setLoading(false);
        // console.log(reportDataCSV);

        return rows;
      } catch (error) {
        console.log(error);
        return rows;
      }
    },
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'Type', key: 'type' },
    { label: 'Status', key: 'status' },
    { label: 'Customer Name', key: 'customer_name' },
    { label: 'Customer ID', key: 'customer_id' },
    { label: 'Served By', key: 'served_by' },
    { label: 'Collected By', key: 'collected_by' },
    { label: 'Total Payment After Tax and Service', key: 'total_payment_after_tax_service' },
    { label: 'Tax Amount', key: 'tax_percent' },
    { label: 'Service Amount', key: 'service_percent' },
    { label: 'Total Tax and Service', key: 'total_tax_service' },
    { label: 'Initial Balance', key: 'initial_balance' },
    { label: 'Final Balance', key: 'final_balance' },
    { label: 'Payment Method', key: 'payment_method' },
    { label: 'Order Name', key: 'order_name' },
    { label: 'Order Category', key: 'order_category' },
    { label: 'Order Amount', key: 'order_amount' },
    { label: 'Order Price', key: 'order_price' },
    { label: 'Created At', key: 'created_at' },
    { label: 'Updated At', key: 'updated_at' },
    { label: 'Note', key: 'note' },
  ];

  return (
    <div className="bg-gray-200 max-h-screen pt-20 px-8 w-11/12">
      <div className="mb-5 flex justify-between">
        <div className="flex items-center">
          <input type="text" className="px-3 py-1 border border-black/40 rounded-md" placeholder="Search..." onChange={handleSearchReportChange} />
          {loading ? <CircularProgress size={18} color="success" /> : null}
        </div>
        <div className="flex items-center">
          <input
            type="datetime-local"
            id="DTPickerFrom"
            className="px-3 py-1 rounded-md border"
            value={DTPickerFrom}
            onChange={(event: any) => {
              setDTPickerFrom(event.target.value);
              setLoading(true);
              setTimeout(() => {
                reportsRefetch();
              }, 1000);
            }}
          />
          <RiArrowRightDoubleLine size={28} />
          <input
            type="datetime-local"
            id="DTPickerTo"
            className="px-3 py-1 rounded-md border"
            value={DTPickerTo}
            onChange={(event: any) => {
              setDTPickerTo(event.target.value);
              setLoading(true);
              setTimeout(() => {
                reportsRefetch();
              }, 1000);
            }}
          />
          {reports ? (
            <CSVLink data={reportDataCSV} headers={headers}>
              <MdDownload size={28} />
            </CSVLink>
          ) : null}
        </div>
      </div>
      <div className="bg-white">
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 460 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {reports?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  return (
                    <TableRow hover onClick={() => handleOpen(row.id)} role="checkbox" tabIndex={-1} key={row.id} sx={{ cursor: 'pointer' }}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === 'type' && value === 'topup and activate' ? (
                              <div className="flex">
                                <p className="px-3 py-1 bg-green-400 rounded-full">{value}</p>
                              </div>
                            ) : null}
                            {column.id === 'type' && value === 'topup' ? (
                              <div className="flex">
                                <p className="px-3 py-1 bg-green-300 text-gray-800 rounded-full">{value}</p>
                              </div>
                            ) : null}
                            {column.id === 'type' && value === 'checkout' ? (
                              <div className="flex">
                                <p className="px-3 py-1 bg-gray-300 text-black rounded-full">{value}</p>
                              </div>
                            ) : null}
                            {column.id === 'type' && value === 'adjustment' ? (
                              <div className="flex">
                                <p className="px-3 py-1 bg-yellow-200 text-black rounded-full">{value}</p>
                              </div>
                            ) : null}
                            {column.id === 'type' && value === 'pay' ? (
                              <div className="flex">
                                <p className="px-3 py-1 bg-teal-300 text-black rounded-full">{value}</p>
                              </div>
                            ) : null}
                            {column.id === 'type' && value === 'refund' ? (
                              <div className="flex">
                                <p className="px-3 py-1 bg-orange-300 text-black rounded-full">{value}</p>
                              </div>
                            ) : null}
                            {column.id === 'status' && value === 'unpaid' ? (
                              <div className="flex">
                                <p className="text-red-500 rounded-full">{value}</p>
                              </div>
                            ) : null}
                            {column.id !== 'type' && value !== 'unpaid' ? (
                              <p className={'truncate max-w-32'}>
                                {column.format && typeof value === 'number' ? column.format(value) : value}
                                {value ? null : '-'}
                              </p>
                            ) : null}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {reports ? <TablePagination rowsPerPageOptions={[25, 50, 100]} component="div" count={reports.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} /> : null}
        </Paper>
        <Modal open={open} onClose={handleClose} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
          <Box sx={{ ...style, width: 400 }}>
            <div ref={contentToPrint} className="p-5" style={{ fontSize: 10 }}>
              {statusSelectedPaymentData === 'unpaid' ? (
                <div>
                  <h1 id="parent-modal-title" className="text-center font-serif mb-1">
                    Bill Details
                  </h1>
                  <p className="mb-10 font-serif text-center text-red-500">({statusSelectedPaymentData})</p>
                </div>
              ) : (
                <h1 id="parent-modal-title" className="text-center font-serif mb-10">
                  Bill Details
                </h1>
              )}
              <div className="font-serif border-t mb-4">
                <div className="flex justify-between">
                  <div>Date, Time</div>
                  <div>
                    {selectedPaymentData ? new Date(selectedPaymentData.created_at).toLocaleDateString() : null}, {selectedPaymentData ? new Date(selectedPaymentData.created_at).toLocaleTimeString() : null}
                  </div>
                </div>
                {/* <div className="flex justify-between items-center">
                <div>Receipt Number</div>
                <div className="text-xs">{selectedPaymentData ? selectedPaymentData.id : null}</div>
              </div> */}
                <div className="flex justify-between">
                  <div>Receipt Number</div>
                  <div>{selectedPaymentData ? selectedPaymentData.report_id : null}</div>
                </div>
                <div className="flex justify-between">
                  <div>Collected By</div>
                  <div>{selectedPaymentData ? selectedPaymentData.collected_by : null}</div>
                </div>
                <div className="flex justify-between">
                  <div>Customer</div>
                  <div>{selectedPaymentData ? selectedPaymentData.customer_name : null}</div>
                </div>
              </div>

              <div className="font-serif border-t mb-4">
                {selectedPaymentData?.type === 'refund'
                  ? selectedPaymentData?.refunded_order_amount.map((amount: number, i: number) => {
                      if (amount > 0) {
                        return (
                          <div className="flex justify-between items-center my-2">
                            <div className="flex">
                              <div>
                                {selectedPaymentData?.order_name[i]} x {amount}
                              </div>
                            </div>
                            <div>- {Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(selectedPaymentData.order_price[i] * selectedPaymentData.order_amount[i])}</div>
                          </div>
                        );
                      }
                    })
                  : selectedPaymentData?.order_name.map((order: any, i: number) => (
                      <div className="flex justify-between items-center my-2">
                        <div className="flex">
                          <div>
                            {order} x {selectedPaymentData.order_amount[i]}
                          </div>
                        </div>
                        <div>{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(selectedPaymentData.order_price[i] * selectedPaymentData.order_amount[i])}</div>
                      </div>
                    ))}
                {selectedPaymentData?.type !== 'pay' && selectedPaymentData?.type !== 'refund' ? (
                  <div className="flex justify-between">
                    <div>{selectedPaymentData?.type}</div>
                    <div>{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(selectedPaymentData?.total_payment)}</div>
                  </div>
                ) : null}
              </div>

              {selectedPaymentData?.type !== 'pay' && selectedPaymentData?.type !== 'refund' ? null : (
                <div className="font-serif border-t mb-6">
                  <div className="flex justify-between">
                    <div>Subtotal</div>
                    <div>{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalPaymentSelectedData)}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Service</div>
                    <div>{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalServiceSelectedData)}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>PB1</div>
                    <div>{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalTaxSelectedData)}</div>
                  </div>
                </div>
              )}

              <div className="font-serif font-bold border-t py-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold">Total</p>
                  </div>
                  <div>
                    <p className="font-bold">{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalPaymentAfterTaxServiceSelectedData)}</p>
                  </div>
                </div>
              </div>

              <div className="font-serif border-t pt-2 mb-2">
                <div className="flex justify-between">
                  <div>{selectedPaymentData?.payment_method}</div>
                  <div>{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalPaymentAfterTaxServiceSelectedData)}</div>
                </div>
              </div>

              <div className="font-serif pt-2">
                <div>Note:</div>
                <div>{selectedPaymentData ? selectedPaymentData.note : null}</div>
              </div>
              <button
                onClick={() => {
                  handlePrint(null, () => contentToPrint.current);
                }}
              >
                PRINT
              </button>
              <div className="font-serif pt-6 flex justify-center">
                {selectedPaymentData?.type === 'pay' && selectedPaymentData?.status === 'paid' ? (
                  <div className="flex">
                    <FullRefundModal />
                    <PartialRefundModal selectedPaymentData={selectedPaymentData} reportsRefetch={reportsRefetch} />
                  </div>
                ) : null}

                <div className="mx-1 text-red-800">
                  <button className=" hover:opacity-30 duration-300" title="Cancel">
                    <ImCancelCircle size={50} />
                  </button>
                </div>
                <div className="text-red-600">
                  <button className=" hover:opacity-30 duration-300" title="Delete">
                    <MdOutlineDelete size={50} />
                  </button>
                </div>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
      {/* <AnotherExample /> */}
    </div>
  );
};

export default ListOfPayment;
