import { Pool } from "pg";

const {
  PGHOST,
  PGPORT,
  PGUSER,
  DBNAME,
  PGPASSWORD,
  ENV,
  TESTDB
} = process.env;

const client = new Pool({
  host: PGHOST,
  port: PGPORT as unknown as (number|undefined),
  user: PGUSER,
  database: (ENV === 'test' ? TESTDB : DBNAME),
  password: PGPASSWORD
});

export default client;