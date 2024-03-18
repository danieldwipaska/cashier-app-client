export default function sum(orders: any): number {
  let result = 0;
  orders.forEach((order: any) => {
    result += order.price * order.amount;
  });

  return result;
}
