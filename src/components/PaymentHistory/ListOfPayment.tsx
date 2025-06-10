import { Box, Button, CircularProgress, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, useMediaQuery } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { ReactComponent as DownloadIcon } from '../../assets/img/icons/download.svg';
import { ReactComponent as ArrowRightDoubleIcon } from '../../assets/img/icons/arrow-right-double.svg';
import { ReactComponent as MinusIcon } from '../../assets/img/icons/minus.svg';
import { ReactComponent as PlusIcon } from '../../assets/img/icons/plus.svg';
import { ReactComponent as OptionIcon } from '../../assets/img/icons/option.svg';
import { ReportStatus, ReportType } from 'configs/utils';
import ModalConfirmation from '../modals/ModalConfirmation';
import orderDiscountedPrice from 'functions/discount.report';
import { NestedModal } from 'components/modals/Modal';
import Invoices from './Invoices';
import { CheckCircle } from '@mui/icons-material';
import { ServiceTax } from 'lib/taxes/taxes.calculation';
import { useMessages } from 'context/MessageContext';
import { Item } from 'context/slices/orderSlice';
import RefundedItem from 'interfaces/RefundedItem';

interface Column {
  id: 'type' | 'report_id' | 'status' | 'customer_name' | 'customer_id' | 'served_by' | 'total_payment_after_tax_service' | 'dateCreatedAt' | 'timeCreatedAt' | 'action';
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
  { id: 'action', label: '', minWidth: 100 },
];

interface Data {
  id: string;
  type: string;
  report_id: string;
  status: string;
  customer_name: string;
  customer_id: string;
  served_by: string;
  total_payment: number;
  total_payment_after_tax_service: number;
  dateCreatedAt: string;
  timeCreatedAt: string;
  items: Item[];
  included_tax_service: boolean;
  tax_percent: number;
  service_percent: number;
}

function createData(
  id: string,
  type: string,
  report_id: string,
  status: string,
  customer_name: string,
  customer_id: string,
  served_by: string,
  total_payment: number,
  total_payment_after_tax_service: number,
  dateCreatedAt: string,
  timeCreatedAt: string,
  items: Item[],
  included_tax_service: boolean,
  tax_percent: number,
  service_percent: number
): Data {
  return {
    id,
    type,
    report_id,
    status,
    customer_name,
    customer_id,
    served_by,
    total_payment,
    total_payment_after_tax_service,
    dateCreatedAt,
    timeCreatedAt,
    items,
    included_tax_service,
    tax_percent,
    service_percent,
  };
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

function PartiallyRefundModal({ row }: { row: Data }) {
  const [open, setOpen] = React.useState(false);
  const [refundedItems, setRefundedItems] = useState(
    row.items.map((item: Item) => {
      return {
        id: item.id ?? '',
        added_refunded_amount: 0,
        refundable_amount: item.amount - (item.refunded_amount ?? 0),
      };
    })
  );

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const decreaseRefundedItems = (id: string) => {
    const newRefundedItems: any = refundedItems.map((item: RefundedItem) => {
      if (item.id === id) {
        const addedRefundedAmount = item.added_refunded_amount ?? 0;

        if (addedRefundedAmount > 0) return { ...item, added_refunded_amount: addedRefundedAmount - 1 };
      }

      return item;
    });

    setRefundedItems(newRefundedItems);
    console.log(newRefundedItems);
  };

  const handleRefund = async () => {
    const emptyRefundedItems = refundedItems.every((item) => item.added_refunded_amount === 0);
    if (emptyRefundedItems) return handleClose();

    const items = refundedItems.filter((item: RefundedItem) => item.added_refunded_amount > 0);

    try {
      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/reports/${row.id}/refund`,
        { items },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        }
      );

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const increaseRefundedItems = (id: string) => {
    const newRefundedItems = refundedItems.map((item) => {
      if (item.id === id) {
        const addedRefundedAmount = item.added_refunded_amount ?? 0;
        const refundableAmount = item.refundable_amount;

        if (refundableAmount > addedRefundedAmount) return { ...item, added_refunded_amount: addedRefundedAmount + 1 };
      }

      return item;
    });

    setRefundedItems(newRefundedItems);
    console.log(newRefundedItems);
  };

  const TotalRefund = () => {
    let totalRefund = 0;
    refundedItems.forEach((item: RefundedItem) => {
      const id = item.id ?? '';
      const addedRefundedAmount = item.added_refunded_amount ?? 0;
      let price = 0;
      let discount_percent = 0;

      row.items.forEach((item: Item) => {
        if (item.id === id) {
          price = item.price;
          discount_percent = item.discount_percent;
        }
      });

      if (discount_percent) {
        totalRefund += price * addedRefundedAmount - (price * addedRefundedAmount * discount_percent) / 100;
      } else {
        totalRefund += price * addedRefundedAmount;
      }
    });

    const taxService = new ServiceTax(totalRefund, row.service_percent, row.tax_percent);

    if (!row.included_tax_service) {
      totalRefund = taxService.calculateTax();
    }

    return <span>{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalRefund)}</span>;
  };

  const findItemData = (id: string) => row.items.find((item) => item.id === id);

  return (
    <React.Fragment>
      {refundedItems.some((item) => item.refundable_amount > 0) && (
        <div className={`py-[10px] px-5 bg-gray-300 hover:bg-gray-500 duration-200 flex items-center justify-center`} onClick={handleOpen}>
          Refund
        </div>
      )}

      <Modal open={open} onClose={handleClose} aria-labelledby="child-modal-title" aria-describedby="child-modal-description">
        <Box sx={{ ...style, width: 400, border: 0 }}>
          <h4 id="child-modal-title" className="font-semibold mb-5">
            Refund <span className=" text-gray-400">- {row.report_id}</span>
          </h4>
          <div className="flex flex-col overflow-y-auto thin-scrollbar mt-2 pr-2 h-60 2xl:h-96">
            {refundedItems?.map((item: RefundedItem) => (
              <div className="mt-5 border-b-2 pb-2" key={item.id}>
                <div className="flex justify-between items-center">
                  <div className="mr-2">
                    <p className="text-sm">{findItemData(item.id)?.fnb_name}</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      className={`bg-green-500 ${item.added_refunded_amount === 0 ? 'opacity-50' : 'hover:bg-green-700'} duration-500 p-2 rounded-md`}
                      onClick={() => {
                        decreaseRefundedItems(item.id ?? '');
                      }}
                    >
                      <MinusIcon className="w-[10px]" />
                    </button>
                    <div className="mx-1">
                      <input type="text" className="text-xs text-center text-black/80 py-1 px-2 rounded-md border border-black/40 max-w-8" readOnly value={item.added_refunded_amount} />
                    </div>
                    <button
                      className={`bg-green-500 ${item.added_refunded_amount === item.refundable_amount ? 'opacity-50' : 'hover:bg-green-700'} duration-500 p-2 rounded-md`}
                      onClick={() => {
                        increaseRefundedItems(item.id ?? '');
                      }}
                    >
                      <PlusIcon className="w-[10px]" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between mt-2">
                  <div></div>
                  {findItemData(item.id)?.discount_percent ? (
                    <div className="flex items-center">
                      <p className="text-sm text-orange-500 mr-1">({findItemData(item.id)?.discount_percent}%)</p>
                      <p className="text-sm">
                        -{' '}
                        {Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                          orderDiscountedPrice({ price: findItemData(item.id)?.price ?? 0, amount: item.added_refunded_amount ?? 0, discountPercent: findItemData(item.id)?.discount_percent ?? 0 })
                        )}
                      </p>
                    </div>
                  ) : (
                    <div className="">
                      <p className="text-sm">- {Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format((findItemData(item.id)?.price ?? 0) * (item.added_refunded_amount ?? 0))}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium text-sm">
              Total Refund : - Rp. <TotalRefund />
            </p>
          </div>
          <div className="mt-5 flex gap-2">
            <ModalConfirmation buttonContent="Refund" confirm={handleRefund}>
              <p className="text-xl font-semibold">Warning</p>
              <p className="mt-2">Refund this payment?</p>
            </ModalConfirmation>
            <Button variant="contained" color="error" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

const ListOfPayment = () => {
  const { showMessage } = useMessages();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [DTPickerFrom, setDTPickerFrom] = React.useState('');
  const [DTPickerTo, setDTPickerTo] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [reportDataCSV, setReportDataCSV] = React.useState<any>([]);

  const [searchedReport, setSearchedReport] = React.useState('');

  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openRefundDetailModal, setOpenRefundDetailModal] = useState(false);
  const [selectedPaymentData, setSelectedPaymentData] = useState<any>(null);
  const [totalPaymentSelectedData, setTotalPaymentSelectedData] = useState(0);
  const [totalRefundSelectedData, setTotalRefundSelectedData] = useState(0);

  // Dropdowns
  const [openDropdownId, setOpenDropdownId] = useState('');

  const fullHD = useMediaQuery('(min-width:1400px)');

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (!event.target.closest('#dropdown-dialog')) {
        setOpenDropdownId('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchReportChange = (event: any) => {
    setSearchedReport(event.target.value);
    setTimeout(() => {
      reportsRefetch();
    }, 500);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
  };

  const handleCloseRefundDetailModal = () => {
    setOpenRefundDetailModal(false);
  };

  const handleOpenDetailModal = () => {
    setOpenDetailModal(true);
  };

  const handleOpenRefundDetailModal = () => {
    setOpenRefundDetailModal(true);
  };

  const handleDropdown = (id: string) => {
    setOpenDropdownId(id);
  };

  const { data: reports, refetch: reportsRefetch } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const rows: Data[] = [];

      try {
        let res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/reports?from=${DTPickerFrom}&to=${DTPickerTo}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        });
        if (!res.data) return rows;

        if (searchedReport) {
          res.data.data = res.data.data.filter((report: any) => {
            return report.customer_id.toLowerCase().indexOf(searchedReport.toLowerCase()) !== -1 || report.report_id.toLowerCase().indexOf(searchedReport.toLowerCase()) !== -1;
          });
        }

        res.data.data.forEach((report: any) => {
          const items = report.Item?.map((item: any) => {
            return {
              id: item.id,
              fnb_id: item.fnb_id,
              fnb_name: item.fnb.name,
              amount: item.amount,
              price: item.price,
              refunded_amount: item.refunded_amount,
              discount_percent: item.discount_percent,
            };
          });

          rows.push(
            createData(
              report.id,
              report.type,
              report.report_id,
              report.status,
              report.customer_name,
              report.customer_id,
              report.crew.name,
              report.total_payment,
              report.total_payment_after_tax_service,
              new Date(report.updated_at).toLocaleDateString(),
              new Date(report.updated_at).toLocaleTimeString(),
              items,
              report.included_tax_service,
              report.tax_percent,
              report.service_percent
            )
          );
        });

        const reportCSVData = res.data.data.map((report: any) => {
          return {
            ...report,
            served_by: report.crew.name,
            payment_method: report.method.name,
          }
        });


        setReportDataCSV(reportCSVData);

        setLoading(false);
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
    { label: 'Total Payment After Tax and Service', key: 'total_payment_after_tax_service' },
    { label: 'Tax Amount', key: 'tax_percent' },
    { label: 'Service Amount', key: 'service_percent' },
    { label: 'Initial Balance', key: 'initial_balance' },
    { label: 'Final Balance', key: 'final_balance' },
    { label: 'Payment Method', key: 'payment_method' },
    { label: 'Created At', key: 'created_at' },
    { label: 'Updated At', key: 'updated_at' },
    { label: 'Note', key: 'note' },
  ];

  const cancelOpenBill = async (id: string) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/reports/${id}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      });

      reportsRefetch();
      showMessage('Payment has been cancelled', 'success');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-200 max-h-screen pt-20 px-8 w-full">
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
          <ArrowRightDoubleIcon className="w-[25px] mx-2" />
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
              <DownloadIcon className="w-[25px] ml-2" />
            </CSVLink>
          ) : null}
        </div>
      </div>
      <div className="bg-white">
        <Paper sx={{ overflow: 'hidden' }}>
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
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                      onClick={() => {
                        let totalRefund = 0;
                        row.items?.forEach((item: Item) => {
                          if (item.refunded_amount && item.discount_percent) {
                            totalRefund += item.price * item.refunded_amount - (item.price * item.refunded_amount * item.discount_percent) / 100;
                          } else if (item.refunded_amount) {
                            totalRefund += item.price * item.refunded_amount;
                          }
                        });

                        let taxService = new ServiceTax(totalRefund, row.service_percent, row.tax_percent);

                        if (!row.included_tax_service) {
                          totalRefund = taxService.calculateTax();
                        }

                        setSelectedPaymentData(row);
                        setTotalPaymentSelectedData(row.total_payment_after_tax_service);
                        setTotalRefundSelectedData(totalRefund);
                      }}
                    >
                      {columns.map((column) => {
                        if (column.id === 'action') {
                          return (
                            <TableCell key={column.id} align={column.align} sx={{ fontSize: 12, position: 'relative' }}>
                              <OptionIcon
                                className="w-[30px]"
                                onClick={() => {
                                  handleDropdown(row.id);
                                }}
                              />
                              <div
                                className={`absolute hover:cursor-pointer z-[1] duration-200 transition-all overflow-hidden -translate-x-1/2 ${openDropdownId !== row.id ? 'max-h-0 opacity-0' : 'max-h-60 opacity-100'}`}
                                id="dropdown-dialog"
                              >
                                <PartiallyRefundModal row={row} />
                                <ModalConfirmation
                                  buttonContent={'Cancel'}
                                  confirm={() => {
                                    cancelOpenBill(row.id);
                                  }}
                                  row={row}
                                >
                                  <p className="text-xl font-semibold">Warning</p>
                                  <p className="mt-2">Cancel this payment?</p>
                                </ModalConfirmation>
                                <div className="py-[10px] px-5 bg-gray-300 hover:bg-gray-400 duration-200 flex items-center justify-center" onClick={handleOpenDetailModal}>
                                  Receipt
                                </div>
                                {row.items?.some((item) => (item.refunded_amount ?? 0) > 0) ? (
                                  <div className="py-[10px] px-5 bg-gray-300 hover:bg-gray-400 duration-200 flex items-center justify-center" onClick={handleOpenRefundDetailModal}>
                                    Refund Receipt
                                  </div>
                                ) : null}
                              </div>
                            </TableCell>
                          );
                        }

                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align} sx={{ fontSize: 12 }}>
                            {column.id === 'type' && value === ReportType.TOPUP_AND_ACTIVATE ? (
                              <div className="flex">
                                <p className="px-3 py-1 bg-green-400 rounded-full text-xs">{value}</p>
                              </div>
                            ) : null}
                            {column.id === 'type' && value === ReportType.TOPUP ? (
                              <div className="flex">
                                <p className="px-3 py-1 bg-green-300 text-gray-800 rounded-full">{value}</p>
                              </div>
                            ) : null}
                            {column.id === 'type' && value === ReportType.CHECKOUT ? (
                              <div className="flex">
                                <p className="px-3 py-1 bg-gray-300 text-black rounded-full">{value}</p>
                              </div>
                            ) : null}
                            {column.id === 'type' && value === ReportType.ADJUSTMENT ? (
                              <div className="flex">
                                <p className="px-3 py-1 bg-yellow-200 text-black rounded-full">{value}</p>
                              </div>
                            ) : null}
                            {column.id === 'type' && value === ReportType.PAY && !row.items.some((item) => (item.refunded_amount ?? 0) > 0) ? (
                              <div className="flex gap-2">
                                <p className="px-3 py-1 bg-teal-300 text-black rounded-full">{value}</p>
                              </div>
                            ) : null}
                            {column.id === 'type' && value === ReportType.PAY && row.items.some((item) => (item.refunded_amount ?? 0) > 0) ? (
                              <div className="flex gap-2">
                                <p className="px-3 py-1 bg-teal-300 text-black rounded-full">{value}</p>
                                <p className="px-3 py-1 bg-orange-300 text-black rounded-full">refunded</p>
                              </div>
                            ) : null}
                            {column.id === 'status' && value === ReportStatus.UNPAID ? (
                              <div className="flex gap-2">
                                <p className="text-yellow-600 rounded-full">{value}</p>
                              </div>
                            ) : null}
                            {column.id === 'status' && value === ReportStatus.CANCELLED ? (
                              <div className="flex gap-2">
                                <p className="text-red-500 rounded-full">{value}</p>
                              </div>
                            ) : null}
                            {column.id !== 'type' && value !== ReportStatus.UNPAID && value !== ReportStatus.CANCELLED ? (
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
      </div>
      <NestedModal open={openDetailModal} handleClose={handleCloseDetailModal} divClass={`overflow-y-auto max-h-screen`}>
        <div className=" relative">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold mt-5">Bahari Irish Pub</h1>
            <p>Jl. Kawi No.8A, Kota Malang</p>
            <p>Indonesia, 65119</p>
            <div className="my-3 w-full border border-b-black border-dashed"></div>
            <p>{selectedPaymentData?.report_id}</p>
            <div className="my-3 w-full border border-b-black border-dashed"></div>
          </div>
          <div className="flex justify-between">
            <p>{selectedPaymentData?.dateCreatedAt}</p>
            <p>{selectedPaymentData?.timeCreatedAt}</p>
          </div>
          <div className="flex justify-between">
            <p>Served by</p>
            <p>{selectedPaymentData?.served_by}</p>
          </div>
          <div className="flex justify-between">
            <p>Customer Name</p>
            <p>{selectedPaymentData?.customer_name}</p>
          </div>
          <div className="my-3 w-full border border-b-black border-dashed"></div>
          <div>
            {selectedPaymentData?.items?.map((item: Item, i: number) => (
              <div key={i} className="flex justify-between">
                <div className="flex">
                  <div>{item.fnb_name}</div>
                  <div>...x {selectedPaymentData?.items[i].amount}</div>
                </div>
                <div>{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(selectedPaymentData?.items[i].price * selectedPaymentData?.items[i].amount)}</div>
              </div>
            ))}
            {selectedPaymentData?.type !== ReportType.PAY ? (
              <div className="flex justify-between">
                <div>{selectedPaymentData?.type}</div>
                <div>{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(selectedPaymentData?.total_payment_after_tax_service)}</div>
              </div>
            ) : null}

            <div className="my-3 w-full border border-b-black border-dashed"></div>

            {selectedPaymentData?.type !== ReportType.PAY ? null : (
              <div className=" mb-1">
                <div className="flex justify-between">
                  <div>Subtotal</div>
                  <div>{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(selectedPaymentData?.total_payment)}</div>
                </div>
                <div className="flex justify-between">
                  <div>Service {selectedPaymentData.included_tax_service ? '- included' : ''}</div>
                  <div></div>
                </div>
                <div className="flex justify-between">
                  <div>Tax (PB1) {selectedPaymentData.included_tax_service ? '- included' : ''}</div>
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
                  <div>{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalPaymentSelectedData ? totalPaymentSelectedData : 0)}</div>
                </div>
              </div>
            </div>

            <div className="my-3 w-full border border-b-black border-dashed"></div>

            <div>
              <div>Note:</div>
              <div>{selectedPaymentData ? selectedPaymentData.note : null}</div>
            </div>
          </div>
          <div className="flex justify-end">
            <Invoices selectedPaymentData={selectedPaymentData} totalPaymentSelectedData={totalPaymentSelectedData} />
          </div>

          {selectedPaymentData?.status === ReportStatus.PAID ? (
            <div className="absolute top-4 right-0">
              <CheckCircle sx={{ fontSize: 40 }} color="success" />
            </div>
          ) : (
            <div className="opacity-60 absolute top-2 right-0 p-2 border border-black font-semibold">{selectedPaymentData?.status}</div>
          )}
        </div>
      </NestedModal>
      <NestedModal open={openRefundDetailModal} handleClose={handleCloseRefundDetailModal} divClass={`overflow-y-auto max-h-screen`}>
        <div className=" relative">
          <div className="flex flex-col items-center">
            <h1 className="text-base font-bold">Bahari Irish Pub</h1>
            <p>Jl. Kawi No.8A, Kota Malang</p>
            <p>Indonesia, 65119</p>
            <div className="my-3 w-full border border-b-black border-dashed"></div>
            <p>{selectedPaymentData?.served_by}</p>
            <div className="my-3 w-full border border-b-black border-dashed"></div>
          </div>
          <div className="flex justify-between">
            <p>{selectedPaymentData?.dateCreatedAt}</p>
            <p>{selectedPaymentData?.timeCreatedAt}</p>
          </div>
          <div className="flex justify-between">
            <p>Receipt Number</p>
            <p>{selectedPaymentData?.report_id}</p>
          </div>
          <div className="flex justify-between">
            <p>Customer Name</p>
            <p>{selectedPaymentData?.customer_name}</p>
          </div>
          <div className="my-3 w-full border border-b-black border-dashed"></div>
          <div>
            {selectedPaymentData?.items?.map((item: Item, i: number) =>
              item.refunded_amount ? (
                <div key={item.id} className="flex justify-between">
                  <div className="flex">
                    <div>{item.fnb_name}</div>
                    <div>...x {selectedPaymentData?.items[i].refunded_amount}</div>
                  </div>
                  <div>- {Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(selectedPaymentData?.items[i].price * selectedPaymentData?.items[i].refunded_amount)}</div>
                </div>
              ) : null
            )}

            <div className="my-3 w-full border border-b-black border-dashed"></div>

            {selectedPaymentData?.type !== ReportType.PAY ? null : (
              <div className=" mb-1">
                <div className="flex justify-between">
                  <div>Service {selectedPaymentData.included_tax_service ? '- included' : ''}</div>
                  <div></div>
                </div>
                <div className="flex justify-between">
                  <div>Tax (PB1) {selectedPaymentData.included_tax_service ? '- included' : ''}</div>
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
                  <div>- {Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalRefundSelectedData ? totalRefundSelectedData : 0)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </NestedModal>
    </div>
  );
};

export default ListOfPayment;
