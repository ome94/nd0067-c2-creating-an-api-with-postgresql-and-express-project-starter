import client from "../database";

export type Book = {
  title: string;
  author: string;
  isbn: string;
  year: number;
}

export class BookShelf {
  async index(): Promise<Book[]> {
    const sql = `SELECT b.title, a.name author, b.isbn, b.year
    FROM books b JOIN authors a ON b.author_id = a.id`;
    const conn = await client.connect();
    const books = await conn.query(sql);

    conn.release();
    return books.rows;
  }

  async show(title: string): Promise<Book[]> {
    const sql = `SELECT b.title, a.name author, b.isbn, b.year
    FROM books b JOIN authors a ON b.author_id = a.id
    WHERE b.title = $1`;
    const conn = await client.connect();
    const books = await conn.query(sql, [title]);

    conn.release();
    return books.rows;
  }

  async create(book: Book): Promise<Book> {
    const sql = `INSERT INTO books(title, author_id, isbn, year)
    VALUES ($1, $2, $3, $4)`;
    const {title, isbn, year, author} = book;
    const conn = await client.connect();
    const books = await conn.query(sql, [title, author, isbn, year]);
    
    conn.release();
    return books.rows[0];
  }

}