import { 
  startOfMonth, 
  endOfMonth, 
  parseISO, 
  format, 
  addDays,
  isWithinInterval,
  getDaysInMonth
} from 'date-fns';
import { id } from 'date-fns/locale';

export const processMonthlySales = (reports: any) => {
  // Get current date
  const currentDate = new Date();
  
  // Get first and last day of current month
  const firstDay = startOfMonth(currentDate);
  const lastDay = endOfMonth(currentDate);
  
  // Get number of days in current month
  const daysInMonth = getDaysInMonth(currentDate);

  // Initialize result object with all days in month
  const result: { [key: string]: number } = {};
  
  // Fill in all days with 0 initially
  for (let i = 1; i <= daysInMonth; i++) {
    result[i.toString()] = 0;
  }

  // Process each report
  reports.forEach((report: any) => {
    const reportDate = parseISO(report.created_at.toString());
    
    // Function to check if a date falls within business hours
    const getBusinessDay = (date: Date) => {
      const hours = date.getHours();
      // If time is between 00:00-03:00, consider it previous day's business
      if (hours >= 0 && hours < 3) {
        return addDays(date, -1);
      }
      return date;
    };

    const businessDate = getBusinessDay(reportDate);
    
    // Check if the report falls within current month
    if (isWithinInterval(businessDate, { start: firstDay, end: lastDay })) {
      const dayKey = format(businessDate, 'd'); // Get day of month as number
      result[dayKey] += report.total_payment_after_tax_service;
    }
  });

  return result;
};

// Helper function to get the date range string
export const getMonthRangeString = () => {
  const currentDate = new Date();
  const firstDay = startOfMonth(currentDate);
  const lastDay = endOfMonth(currentDate);
  
  return {
    start: format(firstDay, 'dd MMMM yyyy', { locale: id }),
    end: format(lastDay, 'dd MMMM yyyy', { locale: id }),
    monthYear: format(currentDate, 'MMMM yyyy', { locale: id })
  };
};
