import orderDiscountedPrice from './discount.report';

export interface ICalculateTaxService {
  totalPayment: number;
  servicePercent: number;
  taxPercent: number;
}

export const calculateDiscountedPrice = (orders: any[]) => {
  let totalDiscountedPrice = 0;

  orders.forEach((order: any) => {
    if (order.discount_status) {
      totalDiscountedPrice += orderDiscountedPrice({
        price: order.price,
        amount: order.amount,
        discountPercent: order.discount_percent,
      });
    } else {
      totalDiscountedPrice += order.price * order.amount;
    }
  });

  return totalDiscountedPrice;
};
