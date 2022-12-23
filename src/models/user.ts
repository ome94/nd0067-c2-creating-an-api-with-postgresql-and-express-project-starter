import client from "../database";
import bcrypt from 'bcrypt';

const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = parseInt(<unknown>process.env.SALT_NUM as string);

export type User = {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
}

export class UserRegistry {

  async auth(username: string, password: string): Promise<User | null> {
    const sql = `SELECT * FROM users
    WHERE username = $1`;
    const conn = await client.connect();
    const result = (await conn.query(sql, [username])).rows;
    conn.release();

    const user: User | null = result.length ? <unknown>result[0] as User : null;
    return bcrypt.compareSync(password+pepper, (user as User).password) ? user : null;
  }

  async index(): Promise<User[]> {
    const sql = `SELECT * FROM users`;
    const conn = await client.connect();
    const users = await conn.query(sql);

    conn.release();
    return users.rows;
  }

  async create(user: User): Promise<User> {
    const sql = `INSERT INTO 
    users(username, password, firstname, lastname)
    VALUES ($1, $2, $3, $4)`;
    
    const { username, firstname, lastname } = user;

    const hash = bcrypt.hashSync(user.password+pepper, saltRounds);
    const conn = await client.connect();
    const users = await conn.query(sql, [username, hash, firstname, lastname]);
    conn.release();

    return users.rows[0];
  }
}