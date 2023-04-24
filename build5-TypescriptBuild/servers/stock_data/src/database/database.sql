CREATE DATABASE stock_data

CREATE TABLE stock_data (
  stock_id SERIAL PRIMARY KEY,
  ticker TEXT NOT NULL,
  price NUMERIC NOT NULL,
  company TEXT NOT NULL,
  volume INTEGER NOT NULL,
  last_update TIMESTAMP NOT NULL
);

