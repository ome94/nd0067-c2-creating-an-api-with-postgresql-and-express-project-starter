CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  password VARCHAR NOT NULL,
  firstname VARCHAR(50),
  lastname VARCHAR(50),
  status VARCHAR(10) --[admin, ...]
);