import bcrypt from 'bcrypt';

import client from "../database";

const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = parseInt(<unknown>process.env.SALT_NUM as string);

export type UserInfo = {
  id?: number; 
  username: string;
  password: string;
  firstname?: string;
  lastname?: string;
  status?: string;
}

export class User {

  async create(user: UserInfo): Promise<UserInfo> {
    const sql = `INSERT INTO 
        users(username, password, firstname, lastname, status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`;
    
    const password = bcrypt.hashSync(user.password+pepper, saltRounds);
    const { username, firstname, lastname, status } = user;

    const conn = await client.connect();
    const result = await conn.query(sql, [username, password, firstname, lastname, status]);
    user = result.rows[0];
    
    conn.release();

    return user;
  }


  async authenticate(username: string, password: string): Promise<UserInfo | null> {
    const sql = `SELECT * FROM users
        WHERE username = $1`;

    const conn = await client.connect();
    const result = (await conn.query(sql, [username])).rows;
    conn.release();

    const user = result ? result[0] : null;
    
    return user ? 
           (bcrypt.compareSync(password+pepper, user.password) ? user : null) :
            null;
  }
  

  async index(): Promise<UserInfo[]> {
    const sql = `SELECT * FROM users`;
    
    const conn = await client.connect();
    const users = (await conn.query(sql)).rows;
    conn.release();

    return users;
  }

  
  async show(username: string): Promise<UserInfo> {
    const sql = `SELECT * FROM users WHERE username = $1`;

    const conn = await client.connect();
    const user = (await conn.query(sql, [username])).rows[0];
    conn.release();

    return user;
  }

  async delete (username?: string) {
    const sql = username ?
      `DELETE FROM users WHERE username = $1 RETURNING *` :
      `DELETE FROM users RETURNING *`
    ;
    
    const conn = await client.connect();
    await conn.query(sql, username ? [username]: undefined);
    conn.release();
  }
}