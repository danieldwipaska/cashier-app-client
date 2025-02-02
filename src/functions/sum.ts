// Sum of discounted prices of orders
export default function sum(orders: any): number {
  let result = 0;
  orders.forEach((order: any) => {
    if (order.discount_status) {
      result += (order.price - (order.price * order.discount_percent) / 100) * order.amount;
    } else {
      result += order.price * order.amount;
    }
  });

  return result;
}
