CREATE TABLE IF NOT EXISTS orders(
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  status VARCHAR(10) DEFAULT 'active' -- NULL value indicates active/incomplete order
);