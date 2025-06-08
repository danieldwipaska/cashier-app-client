import { ServiceTax } from "lib/taxes/taxes.calculation";

export const getOperationalHours = () => {
  const today = new Date();
  let from: Date;
  let to: Date;

  if (today.getHours() <= 15) {
    // Set "from" time to 15:00 yesterday
    from = new Date(today);
    from.setDate(from.getDate() - 1);
    from.setHours(15, 0, 0, 0);

    // Set "to" time to 04:00 today
    to = new Date(today);
    to.setHours(4, 0, 0, 0);
  } else {
    // Set "from" time to 15:00 today
    from = new Date(today);
    from.setHours(15, 0, 0, 0);

    // Set "to" time to 04:00 tomorrow
    to = new Date(today);
    to.setDate(to.getDate() + 1);
    to.setHours(4, 0, 0, 0);
  }

  return {
    from: from.toISOString(),
    to: to.toISOString(),
  };
};

export const getWeeklyOperationalHours = () => {
  const today = new Date();
  
  const thisMonday = new Date(today);
  const diff = today.getDay() - 1; 
  
  if (diff < 0) { 
    thisMonday.setDate(today.getDate() + 1);
  } else {
    thisMonday.setDate(today.getDate() - diff);
  }
  
  const from = new Date(thisMonday);
  from.setHours(15, 0, 0, 0);
  
  const to = new Date(thisMonday);
  to.setDate(to.getDate() + 7);
  to.setHours(3, 0, 0, 0);
  
  return {
    from: from.toISOString(),
    to: to.toISOString(),
  };
};

export const getMonthlyOperationalHours = () => {
  const today = new Date();
  
  // Get first day of current month
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  firstDayOfMonth.setHours(15, 0, 0, 0);
  
  // Get last day of current month
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  lastDayOfMonth.setHours(3, 0, 0, 0);
  
  return {
    from: firstDayOfMonth.toISOString(),
    to: lastDayOfMonth.toISOString(),
  };
};

export const getTotalPayment = (reports: any) => {
  let totalPayment = 0;
  let totalRefund = 0;

  reports?.forEach((report: any) => {
    totalPayment += report.total_payment_after_tax_service;

    for (let item of report.Item) {
      if (item.refunded_amount && item.discount_percent) {
        totalRefund += item.price * item.refunded_amount - (item.price * item.refunded_amount * item.discount_percent) / 100;
      } else if (item.refunded_amount) {
        totalRefund += item.price * item.refunded_amount;
      }
    }
    
    let taxService = new ServiceTax(totalRefund, report.service_percent, report.tax_percent);
    
    if (!report.included_tax_service) {
      totalRefund = taxService.calculateTax();
    }
  });

  return totalPayment - totalRefund;
};
