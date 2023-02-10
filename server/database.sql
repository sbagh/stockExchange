CREATE DATABASE StockExchangeDB

-- \c into StockExchangeDB

CREATE TABLE user_portfolio (
  user_id SERIAL PRIMARY KEY,
  user_name TEXT NOT NULL,
  cash NUMERIC NOT NULL
);

CREATE TABLE stock_holdings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES user_portfolio(user_id),
  stock_ticker TEXT NOT NULL,
  quantity INTEGER NOT NULL
);

CREATE TABLE stock_data (
  stock_id SERIAL PRIMARY KEY,
  ticker TEXT NOT NULL,
  price NUMERIC NOT NULL,
  company TEXT NOT NULL,
  volume INTEGER NOT NULL,
  last_update TIMESTAMP NOT NULL
);

CREATE TABLE trade_history (
  trade_id SERIAL PRIMARY KEY,
  ticker TEXT NOT NULL,
  buyer_id INTEGER NOT NULL REFERENCES user_portfolio(user_id),
  seller_id INTEGER NOT NULL REFERENCES user_portfolio(user_id),
  price NUMERIC NOT NULL,
  quantity INTEGER NOT NULL,
  buy_id UUID NOT NULL,
  sell_id UUID NOT NULL,
  matched_time TIMESTAMP NOT NULL
);