import client from "../database";
import { Order, OrderCard } from "./order";

export type OrderItem = {
  order_id: number;
  product_id: number;
  quantity: number;
}

const orders = new Order();

export class OrderBooking {
  async index(): Promise<OrderItem[]> {
    const sql = 'SELECT * FROM ordered_products';

    const conn = await client.connect();
    const results = (await conn.query(sql)).rows;
    conn.release();

    return results;
  }

  async show(orderId: number): Promise<OrderItem[]> {
    const sql = 'SELECT * FROM ordered_products WHERE order_id = $1';

    const conn = await client.connect();
    const results = (await conn.query(sql, [orderId])).rows;
    conn.release();

    return results;
  }

  async addToCart(productId: number, userId: number, quantity: number=1):
    Promise<OrderItem> {
    const { isNew, id } = await this.getActiveOrder(userId);
    const orderItems = !isNew ? await this.show(id) : [];
    const orderItem = orderItems.find(item => item.product_id === productId);
    quantity += orderItem ? orderItem.quantity : 0;

    const sql = orderItem ? 
              `UPDATE ordered_products SET quantity = $3
              WHERE order_id = $1 AND product_id = $2
              RETURNING *`
              :
              `INSERT INTO ordered_products(order_id, product_id, quantity)
              VALUES($1, $2, $3) RETURNING *
              `
    ;
    
    const conn = await client.connect();
    const result = (await conn.query(sql, [id, productId, quantity])).rows[0];
    conn.release();

    return result;
  }


  async completeOrder(userId: number): Promise<OrderCard> {
    const order = await orders.checkout(userId)

    return order;
  }

  private async getActiveOrder(userId: number): 
    Promise<{ isNew: boolean; id: number }> {
      // get active order_id
      const order = await orders.showActive(userId);
      // create an order if user has no active order
      const { id } = order || await orders.create(userId) as OrderCard
      const isNew = !order ? true : false;
      
      return { isNew, id: <number>id };
  }
}