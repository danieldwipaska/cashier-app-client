export const getOperationalHours = () => {
  const today = new Date();

  // Set "from" time to 13:00 today
  const from = new Date(today);
  from.setHours(15, 0, 0, 0);

  // Set "to" time to 04:00 tomorrow
  const to = new Date(today);
  to.setDate(to.getDate() + 1); // Add 1 day
  to.setHours(4, 0, 0, 0);

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
  reports?.forEach((report: any) => {
    totalPayment += report.total_payment_after_tax_service;
  });

  return totalPayment;
};
