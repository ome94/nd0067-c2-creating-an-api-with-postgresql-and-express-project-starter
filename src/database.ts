import dotenv from 'dotenv';
import { Pool } from "pg";

dotenv.config();

const {
  PGHOST,
  PGPORT,
  PGUSER,
  DBNAME,
  PGPASSWORD
} = process.env;

const client = new Pool({
  host: PGHOST,
  port: PGPORT as (number|undefined),
  user: PGUSER,
  database: DBNAME,
  password: PGPASSWORD
});

export default client;