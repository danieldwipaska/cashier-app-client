import { Box, Button, CircularProgress, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, useMediaQuery } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import { CSVLink } from 'react-csv';
import { MdDownload } from 'react-icons/md';
import { RiArrowRightDoubleLine } from 'react-icons/ri';
import { HiOutlineReceiptRefund, HiReceiptRefund } from 'react-icons/hi';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import Invoices from './Invoices';

interface Column {
  id: 'type' | 'report_id' | 'status' | 'customer_name' | 'customer_id' | 'served_by' | 'total_payment_after_tax_service' | 'dateCreatedAt' | 'timeCreatedAt';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'type', label: 'Type', minWidth: 100 },
  { id: 'report_id', label: 'ID', minWidth: 100 },
  { id: 'status', label: 'Status', minWidth: 100 },
  { id: 'customer_name', label: 'Customer', minWidth: 100 },
  { id: 'customer_id', label: 'Customer ID (Phone)', minWidth: 100 },
  { id: 'served_by', label: 'Served By', minWidth: 50 },
  { id: 'total_payment_after_tax_service', label: 'Total Payment', minWidth: 100, format: (value: number) => Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value) },
  { id: 'dateCreatedAt', label: 'Date', minWidth: 100 },
  { id: 'timeCreatedAt', label: 'Time', minWidth: 100 },
];

interface Data {
  id: string;
  type: string;
  report_id: string;
  status: string;
  customer_name: string;
  customer_id: string;
  served_by: string;
  total_payment_after_tax_service: number;
  orders: string;
  dateCreatedAt: string;
  timeCreatedAt: string;
}

function createData(
  id: string,
  type: string,
  report_id: string,
  status: string,
  customer_name: string,
  customer_id: string,
  served_by: string,
  total_payment_after_tax_service: number,
  orders: string,
  dateCreatedAt: string,
  timeCreatedAt: string
): Data {
  return { id, type, report_id, status, customer_name, customer_id, served_by, total_payment_after_tax_service, orders, dateCreatedAt, timeCreatedAt };
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

  const fullHD = useMediaQuery('(min-width:1400px)');

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
              report.report_id,
              report.status,
              report.customer_name,
              report.customer_id,
              report.served_by,
              report.type === 'pay' || report.type === 'refund' ? report.total_payment_after_tax_service : report.total_payment,
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
    <div className="bg-gray-200 max-h-screen pt-20 px-8 max-w-[1100px]">
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
        <Paper sx={{overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: fullHD ? 480 : 400 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth, fontSize: 12 }}>
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
                          <TableCell key={column.id} align={column.align} sx={{ fontSize: 12 }}>
                            {column.id === 'type' && value === 'topup and activate' ? (
                              <div className="flex">
                                <p className="px-3 py-1 bg-green-400 rounded-full text-xs">{value}</p>
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
                              <p className={'truncate max-w-40'}>
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
            <Invoices selectedPaymentData={selectedPaymentData} totalPaymentSelectedData={totalPaymentSelectedData} />
          </Box>
        </Modal>
      </div>
      {/* <AnotherExample /> */}
    </div>
  );
};

export default ListOfPayment;
