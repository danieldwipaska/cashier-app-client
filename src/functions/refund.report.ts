import orderDiscountedPrice from "./discount.report";

interface ICalculateTaxService {
  price: number;
  amount: number;
  servicePercent: number;
  taxPercent: number;
}

interface ICalculateTaxServiceWithDiscount extends ICalculateTaxService {
  discountPercent: number;
}

export const calculateTaxService = ({ price, amount, servicePercent, taxPercent }: ICalculateTaxService) => {
  const result = ((price * amount * servicePercent) / 100 + price * amount) * (taxPercent / 100);

  return result;
};

export const calculateTaxServiceWithDiscount = ({ price, amount, discountPercent, servicePercent, taxPercent }: ICalculateTaxServiceWithDiscount): number => {
  const result = (((orderDiscountedPrice({ price, amount, discountPercent })) * servicePercent) / 100 + (orderDiscountedPrice({ price, amount, discountPercent }))) * (taxPercent / 100);

  return result;
};
