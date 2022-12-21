import client from "../database";

export type Film = {
  film_id: number;
  title: string;
  description: string;
  release_year: number;
  language_id: number
  rental_duration?: number;
  rental_rate?: string;
  length: number;
  replacement_cost?: string;
  rating: string
  last_update?: Date;
  special_features?: string[];
  fulltext?: string;
}

export class FilmStore {
  async index(): Promise<Film[]> {
    const conn = await client.connect();
    const sql = `SELECT * FROM film`;
    const results = await conn.query(sql);
    
    conn.release();
    return results.rows;
  }

  async show(id: number): Promise<Film> {
    const conn = await client.connect();
    const sql = `SELECT * FROM film
    WHERE film_id = $1`;
    const result = await conn.query(sql, [id]);
    
    conn.release();
    return result.rows[0];
  }

}