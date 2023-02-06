import client from "../database";

import { Order } from "../models/order";
import { OrderBooking } from "../models/ordered-product";
import { ProductStore } from "../models/product";

export type OrderInfo = {
  order_id: number;
  user_id: number;
  product_id: number;
  product: string;
  price: number;
  quantity: number;
  status: string;
}

const products = new ProductStore();
const orders = new Order();
const orderLog = new OrderBooking();

export class OrderService {
  async index(): Promise<OrderInfo[]> {
    const sql = `
      SELECT order_id, user_id, product_id, name product,
          price, quantity, status
      FROM orders o JOIN ordered_products op ON o.id = op.order_id
      JOIN products p ON p.id = op.product_id
    `;

    const conn = await client.connect();
    const results = (await conn.query(sql)).rows
    conn.release();

    return results;
  }

  async show(orderId: number): Promise<OrderInfo[]> {
    const sql = `
      SELECT order_id, user_id, product_id, name product,
        price, quantity, status
      FROM orders o
      JOIN ordered_products op ON o.id = op.order_id
      AND o.id = $1
      JOIN products p ON p.id = op.product_id
    `;

    const conn = await client.connect();
    const results = (await conn.query(sql, [orderId])).rows;
    conn.release();

    return results;
  }

  async currentOrder(userId: number): Promise<OrderInfo[]> {
    const { id } = await orders.showActive(userId) || {};
    const results = id ? await this.show(id) : [];

    return results;
  }

  async addToCart(productId: number, userId: number, quantity: number=1):
  Promise<OrderInfo> {
    const { isNew, id } = await this.getActiveOrder(userId);
    const orderItems = !isNew ? await this.show(id) : [];
    const orderItem = orderItems.find(item => item.product_id === productId);
    quantity += orderItem ? orderItem.quantity : 0;

    const order = orderItem ? 
        orderLog.addToOrder(id, productId, quantity):
        orderLog.create(id, productId, quantity)
    ;

    let orderInfo: OrderInfo = await order.then(async (order) => {
      const {name, price} = await products.show(productId);
      const status = (await orders.show(id)).status as string;
      
      return {
        ...order,
        product: name,
        price: price,
        user_id: userId,
        status: status || 'active'
      }
    });

    return orderInfo;
  }


  async completeOrder(userId: number): Promise<OrderInfo[]> {
    const currentOrder = await this.currentOrder(userId);
    const order = await orders.checkout(userId)

    currentOrder.forEach(ordr => ordr.status = <string>order.status)

    return currentOrder;
  }


  private async getActiveOrder(userId: number): 
  Promise<{ isNew: boolean; id: number }> {
    // get active order_id
    const order = await orders.showActive(userId);
    // create an order if user has no active order
    const { id } = order || await orders.create(userId)
    const isNew = !order ? true : false;
    
    return { isNew, id: <number>id };
  }
}