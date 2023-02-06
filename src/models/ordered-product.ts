import client from "../database";

export type OrderItem = {
  order_id: number;
  product_id: number;
  quantity: number;
}

export class OrderBooking {
  async index(): Promise<OrderItem[]> {
    const sql = 'SELECT * FROM ordered_products';

    const conn = await client.connect();
    const results = (await conn.query(sql)).rows;
    conn.release();

    return results;
  }

  async create(orderId: number, productId: number, quantity: number=1):
    Promise<OrderItem>{
    const sql = `INSERT INTO ordered_products(order_id, product_id, quantity)
    VALUES($1, $2, $3) RETURNING *
    `;

    const conn = await client.connect();
    const result = (await conn.query(sql, [orderId, productId, quantity])).rows[0];
    conn.release();

    return result;
  }

  async show(orderId: number): Promise<OrderItem[]> {
    const sql = 'SELECT * FROM ordered_products WHERE order_id = $1';

    const conn = await client.connect();
    const results = (await conn.query(sql, [orderId])).rows;
    conn.release();

    return results;
  }

  async addToOrder(orderId: number, productId: number, quantity: number=1):
    Promise<OrderItem> {
    const sql = `UPDATE ordered_products SET quantity = $3
              WHERE order_id = $1 AND product_id = $2
              RETURNING *`
    ;
    
    const conn = await client.connect();
    const result = (await conn.query(sql, [orderId, productId, quantity])).rows[0];
    conn.release();

    return result;
  }
}