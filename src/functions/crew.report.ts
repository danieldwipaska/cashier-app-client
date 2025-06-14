import { ServiceTax } from 'lib/taxes/taxes.calculation';
import orderDiscountedPrice from './discount.report';

export const getCrewTotalPurchases = (report: any, categoryIds: any = []) => {
  let totalPurchases = 0;
  let reportRefund = 0;

  report.Item.forEach((item: any) => {
    if (categoryIds.length && categoryIds.includes(item.fnb.category.id)) {
      totalPurchases += orderDiscountedPrice({
        price: item.price,
        amount: item.amount,
        discountPercent: item.discount_percent,
      });
      reportRefund += item.price * item.refunded_amount - (item.price * item.refunded_amount * item.discount_percent) / 100;
    } else if (!categoryIds.length) {
      totalPurchases += orderDiscountedPrice({
        price: item.price,
        amount: item.amount,
        discountPercent: item.discount_percent,
      });
      reportRefund += item.price * item.refunded_amount - (item.price * item.refunded_amount * item.discount_percent) / 100;
    }
  });

  if (!report.included_tax_service) {
    totalPurchases = new ServiceTax(totalPurchases, report.service_percent, report.tax_percent).calculateTax();
    reportRefund = new ServiceTax(reportRefund, report.service_percent, report.tax_percent).calculateTax();
  }

  return { totalPurchases: totalPurchases - reportRefund, isRefunded: !!reportRefund };
};
