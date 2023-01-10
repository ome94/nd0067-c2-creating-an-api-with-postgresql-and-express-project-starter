CREATE TABLE IF NOT EXISTS products(
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  price NUMERIC(7, 2) NOT NULL -- not more than $9, 999, 999.99 
);