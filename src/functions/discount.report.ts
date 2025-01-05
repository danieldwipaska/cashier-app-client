interface IOrderDiscountedPrice {
    price: number;
    amount: number;
    discountPercent: number;
}

export default function orderDiscountedPrice({ price, amount, discountPercent }: IOrderDiscountedPrice): number {
    const result = price * amount - (price * amount * discountPercent) / 100;

    return result;
}
