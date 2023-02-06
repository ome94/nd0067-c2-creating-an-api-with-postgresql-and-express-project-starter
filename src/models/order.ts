import client from "../database";

export type OrderCard = {
  id?: number;
  user_id: number;
  status?: string | null;
}

export class Order {
  async index(): Promise<OrderCard[]> {
    const sql = 'SELECT * FROM orders';
    const conn = await client.connect();
    const results = (await conn.query(sql)).rows;
    conn.release();

    return results;
  }

  async create(userId: number): Promise<OrderCard> {
    const sql = 'INSERT INTO orders(user_id) VALUES($1) RETURNING *';
    const conn = await client.connect();
    const result = (await conn.query(sql, [userId])).rows[0];
    conn.release();
    
    return result
  }

  async show(orderId: number): Promise<OrderCard> {
    const sql = `SELECT * FROM orders
        WHERE order_id = $1`

    const conn = await client.connect();
    const result = (await conn.query(sql, [orderId])).rows[0];
    conn.release();

    return result;
  }

  async showActive(userId: number): Promise<OrderCard> {
    const sql = `
      SELECT * FROM orders 
      WHERE (LOWER(status) = 'active' OR status IS NULL)
      AND user_id = $1
    `;
    
    const conn = await client.connect();
    const result = (await conn.query(sql, [userId])).rows[0];
    conn.release();
    
    return result;
  }

  async checkout(userId: number): Promise<OrderCard> {
    const sql = ` -- complete active order
        UPDATE orders SET status = 'complete'
        WHERE user_id = $1
        AND (status = 'active' OR status IS NULL)
        RETURNING *
        -- active order status CAN also be NULL
    `;

    const conn = await client.connect();
    const result = (await conn.query(sql, [userId])).rows[0];
    conn.release();
    
    return result;
  }
}