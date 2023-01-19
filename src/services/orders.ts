import client from "../database";

import { Order, OrderCard } from "../models/order";

export type OrderInfo = {
  order_id: number;
  user_id: number;
  product_id: number;
  product: string;
  price: number;
  quantity: number;
  status: string;
}

const orders = new Order()

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
    console.log(id);
    const results = id ? await this.show(id) : [];

    return results;
  }

  async allOrders(): Promise<OrderCard[]> {
    return await orders.index();
  }
}