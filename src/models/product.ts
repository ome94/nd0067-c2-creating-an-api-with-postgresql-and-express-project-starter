import client from "../database";

export type Product = {
  id?: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
}

export class ProductStore{
  async index(): Promise<Product[]> {
    const sql = 'SELECT * FROM products';
    
    const conn = await client.connect();
    const results = (await conn.query(sql)).rows;
    conn.release();
    
    return results;
  }

  async create(product: Product): Promise<Product> {
    const {name, description, price, category} = product;
    
    const sql = `
        INSERT INTO
        products(name, description, price, category)
        VALUES($1, $2, $3, $4)
        RETURNING *
    `;

    const conn = await client.connect();
    const result = (await conn.query(sql, [
      name, 
      description, 
      parseFloat(price.toFixed(2)), 
      category
    ])).rows[0];
    conn.release();

    return result;
  }

  async show(productId: number): Promise<Product> {
    const sql = 'SELECT * FROM products WHERE id = $1';
    
    const conn = await client.connect();
    const result = (await conn.query(sql, [productId])).rows[0];
    conn.release();

    return result;
  }

  async delete(productId?: number): Promise<Product[]> {
    const sql = productId ?
    'DELETE FROM products WHERE id = $1 RETURNING *':
    'DELETE FROM products RETURNING *';

    const conn = await client.connect();
    const results = (await conn.query(sql, productId ? [productId] : undefined)).rows;
    conn.release()

    return results;
  }
}