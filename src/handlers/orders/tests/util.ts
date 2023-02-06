import { Order } from "../../../models/order";
import { OrderBooking } from "../../../models/ordered-product";

const orders = new Order();
const orderLog = new OrderBooking

export const deleteAllOrders = async () => {
  await orderLog.delete()
  await orders.delete();
}