CREATE TABLE IF NOT EXISTS ordered_products(
  order_id BIGINT REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity SMALLINT NOT NULL
);