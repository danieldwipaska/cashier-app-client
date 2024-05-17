import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Delete } from '@mui/icons-material';

interface Column {
  id: 'card_number' | 'customer_id' | 'customer_name' | 'balance' | 'status' | 'is_member' | 'updated_at' | 'action';
  label: string;
  minWidth?: number;
  align?: 'right' | 'center';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'card_number', label: 'Number', minWidth: 100 },
  { id: 'customer_id', label: 'Customer ID', minWidth: 100 },
  { id: 'customer_name', label: 'Customer Name', minWidth: 100 },
  { id: 'balance', label: 'Balance', minWidth: 100 },
  { id: 'status', label: 'Status', minWidth: 100 },
  { id: 'is_member', label: 'Member', minWidth: 100 },
  { id: 'updated_at', label: 'Updated At', minWidth: 100 },
  { id: 'action', label: 'Action', minWidth: 100, align: 'center' },
];

interface Data {
  id: string;
  card_number: string;
  customer_id: string;
  customer_name: string;
  balance: number;
  status: 'active' | 'inactive' | 'blocked';
  is_member: string;
  created_at: string;
  updated_at: string;
  action: undefined;
}

function createData(
  id: string,
  card_number: string,
  customer_id: string,
  customer_name: string,
  balance: number,
  status: 'active' | 'inactive' | 'blocked',
  is_member: string,
  created_at: string,
  updated_at: string,
  action: undefined
): Data {
  return { id, card_number, customer_id, customer_name, balance, status, is_member, created_at, updated_at, action };
}

// Modal Style
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const CardManagement = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [cardNumberInput, setCardNumberInput] = React.useState('');
  const [isMemberInput, setIsMemberInput] = React.useState('');

  // Modal Configurations
  const [open, setOpen] = React.useState(false);
  const handleSubmit = async () => {
    try {
      const data: { card_number: string; is_member?: boolean } = {
        card_number: cardNumberInput,
      };

      if (isMemberInput === 'basic') {
        data.is_member = false;
      } else if (isMemberInput === 'member') {
        data.is_member = true;
      }

      await axios.post('http://localhost:3001/cards', data);
      cardsRefetch();

      setCardNumberInput('');
      setIsMemberInput('');
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCardNumberChange = (event: any) => {
    setCardNumberInput(event.target.value);
  };
  const handleIsMemberChange = (event: any) => {
    setIsMemberInput(event.target.value);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const { data: cards, refetch: cardsRefetch } = useQuery({
    queryKey: ['cards'],
    queryFn: async () => {
      const rows: Data[] = [];

      try {
        let res = await axios.get(`http://localhost:3001/cards`);
        if (!res.data) return rows;

        res.data.data.forEach((card: any) => {
          rows.push(
            createData(
              card.id,
              card.card_number,
              card.customer_id,
              card.customer_name,
              card.balance,
              card.status,
              card.is_member ? 'yes' : 'no',
              new Date(card.created_at).toLocaleString(),
              new Date(card.updated_at).toLocaleString(),
              undefined
            )
          );
        });

        return rows;
      } catch (error) {
        console.log(error);
        return rows;
      }
    },
  });

  const [openDeleteConfirmation, setOpenDeleteConfirmation] = React.useState(false);
  const [cardIdToDelete, setCardIdToDelete] = React.useState('');
  const [cardNumberToDelete, setCardNumberToDelete] = React.useState('');
  const handleClickOpenDeleteConfirmation = (id: string, cardNumber: string) => {
    setCardIdToDelete(id);
    setCardNumberToDelete(cardNumber);
    setOpenDeleteConfirmation(true);
  };
  const handleCloseDeleteConfirmation = () => {
    setOpenDeleteConfirmation(false);
  };
  const handleSubmitCardDeletion = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/cards/${id}`);

      cardsRefetch();
      setCardIdToDelete('');
      setCardNumberToDelete('');
      setOpenDeleteConfirmation(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-200 max-h-screen pt-20 px-8 w-11/12">
      <div className="flex justify-end mb-2">
        <div>
          <Button onClick={handleOpen} color="success" variant="contained">
            Register a Card
          </Button>
        </div>
      </div>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
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
              {cards?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];

                      return (
                        <TableCell key={column.id} align={column.align}>
                          {value === undefined ? (
                            <button
                              onClick={() => {
                                handleClickOpenDeleteConfirmation(row.id, row.card_number);
                              }}
                            >
                              <Delete color="error" />
                            </button>
                          ) : (
                            <p className="truncate max-w-40">{column.format && typeof value === 'number' ? column.format(value) : value}</p>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {cards?.length ? (
          <TablePagination rowsPerPageOptions={[10, 100, 500]} component="div" count={cards.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
        ) : null}
      </Paper>
      <Modal open={open} onClose={handleClose} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={{ ...style, width: 500 }}>
          <div>
            <h2 id="parent-modal-title">Register a Card</h2>
          </div>
          <div className="mt-5">
            <div>
              <TextField id="outlined-basic" label="Card Number" variant="outlined" size="small" onChange={handleCardNumberChange} value={cardNumberInput} />
            </div>
            <div className="mt-4">
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel id="demo-select-small-label">Type</InputLabel>
                <Select labelId="demo-select-small-label" id="demo-select-small" value={isMemberInput} label="Type" onChange={handleIsMemberChange}>
                  <MenuItem value={'basic'}>Basic</MenuItem>
                  <MenuItem value={'member'}>Member</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="flex justify-end">
            <div>
              <Button onClick={handleSubmit} color="success" variant="contained">
                Submit
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
      {cardIdToDelete ? (
        <React.Fragment>
          <Dialog open={openDeleteConfirmation} onClose={handleCloseDeleteConfirmation} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{'Are You Sure?'}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Deleting a card number "<span className=" font-bold">{cardNumberToDelete}</span>" will permanently remove the card from the system. Continue?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color="inherit" onClick={handleCloseDeleteConfirmation}>
                Cancel
              </Button>
              <Button
                color="error"
                onClick={() => {
                  handleSubmitCardDeletion(cardIdToDelete);
                }}
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      ) : null}
    </div>
  );
};

export default CardManagement;
