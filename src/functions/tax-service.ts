import orderDiscountedPrice from './discount.report';

export interface ICalculateTaxService {
  totalPayment: number;
  servicePercent: number;
  taxPercent: number;
}

export const calculateDiscountedPrice = (items: any[]) => {
  let totalDiscountedPrice = 0;

  items.forEach((item: any) => {
    if (item.discount_percent && item.discount_percent > 0) {
      totalDiscountedPrice += orderDiscountedPrice({
        price: item.price,
        amount: item.amount,
        discountPercent: item.discount_percent,
      });
    } else {
      totalDiscountedPrice += item.price * item.amount;
    }
  });

  return totalDiscountedPrice;
};
