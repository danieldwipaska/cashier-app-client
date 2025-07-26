import { Box, Modal } from '@mui/material';
import axios from 'axios';
import { ReportStatus, ReportType } from 'configs/utils';
import { useMessages } from 'context/MessageContext';
import { useForm } from 'react-hook-form';

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

const ExportModalForm = ({ open, setOpen }: { open: boolean; setOpen: any }) => {
  const { handleSubmit, register } = useForm();
  const { showMessage } = useMessages();

  const handleClose = () => {

    setOpen(false);
  };

  const onSubmit = async (data: any) => {
    if (!data.startDate || !data.endDate) {
      showMessage('Start date and end date are required', 'error');
      return;
    }
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/exports/reports?from=${data.startDate}&to=${data.endDate}&type=${data.reportType}&status=${data.reportStatus}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          'Content-Type': 'text/csv',
        },
        responseType: 'blob',
      });

      const contentDisposition = response.headers['content-disposition'];
      let filename = 'laporan.csv'; // Nama file default
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename\*?=['"]?(?:UTF-\d['"]*)?([^;\n]*?)['"]?;?/i);
        if (filenameMatch && filenameMatch[1]) {
          filename = decodeURIComponent(filenameMatch[1].replace(/['"]/g, ''));
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showMessage('Failed to export report', 'error');
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose} aria-labelledby="child-modal-title" aria-describedby="child-modal-description">
        <Box sx={{ ...style, width: 400, border: 0 }}>
          <h4 className="mb-3 text-green-700">Export Report Data</h4>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
            <div className="mb-3">
              <label className="flex flex-col gap-1 flex-1">
                Start Date
                <input type="datetime-local" {...register('startDate')} className="px-5 py-2 border border-gray-500 rounded-sm" id="startDate" />
              </label>
            </div>
            <div className="mb-3">
              <label className="flex flex-col gap-1 flex-1">
                End Date
                <input type="datetime-local" {...register('endDate')} className="px-5 py-2 border border-gray-500 rounded-sm" id="endDate" />
              </label>
            </div>
            <div className="mb-3 flex justify-between items-center">
              <label className="" htmlFor="reportType">
                Type
              </label>
              <select {...register('reportType')} id="reportType" className="border px-3 py-2 rounded-sm w-3/5">
                <option value=''>All</option>
                <option value={ReportType.PAY}>Pay</option>
                <option value={ReportType.TOPUP_AND_ACTIVATE}>Topup and Activate</option>
                <option value={ReportType.TOPUP}>Topup</option>
                <option value={ReportType.CHECKOUT}>Checkout</option>
                <option value={ReportType.ADJUSTMENT}>Adjustment</option>
              </select>
            </div>
            <div className="mb-3 flex justify-between items-center">
              <label className="" htmlFor="reportStatus">
                Status
              </label>
              <select {...register('reportStatus')} id="reportStatus" className="border px-3 py-2 rounded-sm w-3/5">
                <option value=''>All</option>
                <option value={ReportStatus.PAID}>Paid</option>
                <option value={ReportStatus.UNPAID}>Unpaid</option>
                <option value={ReportStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>
            <br />
            <div className="flex justify-end">
              <button type="submit" className={`bg-green-400 py-2 px-3 rounded-lg`}>
                Export
              </button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default ExportModalForm;
