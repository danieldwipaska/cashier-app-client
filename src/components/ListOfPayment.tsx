import { CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import { CSVLink } from 'react-csv';
import { MdDownload } from 'react-icons/md';
import { RiArrowRightDoubleLine } from 'react-icons/ri';

interface Column {
  id: 'id' | 'customerName' | 'collectedBy' | 'totalPayment' | 'paymentMethod' | 'orders' | 'dateCreatedAt' | 'timeCreatedAt' | 'note';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'id', label: 'ID', minWidth: 30 },
  { id: 'customerName', label: 'Customer', minWidth: 100 },
  { id: 'collectedBy', label: 'Collected By', minWidth: 100 },
  { id: 'totalPayment', label: 'Total Payment', minWidth: 100 },
  { id: 'paymentMethod', label: 'Method', minWidth: 100 },
  { id: 'orders', label: 'Orders', minWidth: 180 },
  { id: 'dateCreatedAt', label: 'Date', minWidth: 100 },
  { id: 'timeCreatedAt', label: 'Time', minWidth: 120 },
  { id: 'note', label: 'Note', minWidth: 130 },
];

interface Data {
  id: string;
  customerName: string;
  collectedBy: string;
  totalPayment: number;
  paymentMethod: string;
  orders: string;
  dateCreatedAt: string;
  timeCreatedAt: string;
  note: string;
}

function createData(id: string, customerName: string, collectedBy: string, totalPayment: number, paymentMethod: string, orders: string, dateCreatedAt: string, timeCreatedAt: string, note: string): Data {
  return { id, customerName, collectedBy, totalPayment, paymentMethod, orders, dateCreatedAt, timeCreatedAt, note };
}

const ListOfPayment = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [DTPickerFrom, setDTPickerFrom] = React.useState('');
  const [DTPickerTo, setDTPickerTo] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const { data: reports, refetch: reportsRefetch } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const rows: Data[] = [];

      try {
        let res = await axios.get(`http://localhost:3001/reports?from=${DTPickerFrom}&to=${DTPickerTo}`);
        if (!res.data) return rows;

        res.data.data.forEach((report: any) => {
          let ordersString = '';
          report.orders.forEach((order: any) => {
            ordersString += `${order.name} (${order.amount} x ${order.price}); `;
          });
          rows.push(
            createData(
              report.id,
              report.customerName,
              report.collectedBy,
              report.totalPayment,
              report.paymentMethod,
              ordersString,
              new Date(report.createdAt).toLocaleDateString(),
              new Date(report.createdAt).toLocaleTimeString(),
              report.note
            )
          );
        });

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
    { label: 'Customer Name', key: 'customerName' },
    { label: 'Collected By', key: 'collectedBy' },
    { label: 'Total Payment', key: 'totalPayment' },
    { label: 'Payment Method', key: 'paymentMethod' },
    { label: 'Orders', key: 'orders' },
    { label: 'Date', key: 'dateCreatedAt' },
    { label: 'Time', key: 'timeCreatedAt' },
    { label: 'Note', key: 'note' },
  ];

  return (
    <div className="bg-gray-200 max-h-screen pt-20 px-8 w-11/12">
      <div className="mb-5 flex justify-between">
        <div className="flex items-center">
          <p className="mr-2">List of Payment</p>
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
            <CSVLink data={reports} headers={headers}>
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
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number' ? column.format(value) : value}
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
    </div>
  );
};

export default ListOfPayment;
