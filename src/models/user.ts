import bcrypt from 'bcrypt';
import { JwtPayload } from "jsonwebtoken";

import client from "../database";

const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = parseInt(<unknown>process.env.SALT_NUM as string);

export type User = {
  username: string;
  password: string;
  firstname?: string;
  lastname?: string;
  status?: string;
}

export interface UserPayload extends JwtPayload{
  user?: User
}
export class UserRegistry {

  async create(user: User): Promise<User> {
    const sql = `INSERT INTO 
        users(username, password, firstname, lastname, status)
        VALUES ($1, $2, $3, $4, $5)`;
    
    user.password = bcrypt.hashSync(user.password+pepper, saltRounds);
    const { username, password, firstname, lastname, status } = user;

    const conn = await client.connect();
    await conn.query(sql, [username, password, firstname, lastname, status]);
    conn.release();

    return user;
  }


  async authenticate(username: string, password: string): Promise<User | null> {
    const sql = `SELECT * FROM users
        WHERE username = $1`;

    const conn = await client.connect();
    const result = (await conn.query(sql, [username])).rows;
    conn.release();

    const user = result.length ? <User>result[0] : null;
    return bcrypt.compareSync(password+pepper, (<User>user).password) ? user : null;
  }
  

  async index(): Promise<User[]> {
    const sql = `SELECT * FROM users`;
    
    const conn = await client.connect();
    const users = await conn.query(sql);
    conn.release();

    return users.rows;
  }

  
  async show(username: string) {
    const sql = `SELECT * FROM users WHERE username = $1`;

    const conn = await client.connect();
    const results = await conn.query(sql, [username]);
    conn.release();

    return results.rows[0];
  }
}