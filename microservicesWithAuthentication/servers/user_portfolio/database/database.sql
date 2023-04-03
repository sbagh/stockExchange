CREATE DATABASE user_portfolio;

CREATE TABLE cash_holdings (
  portfolio_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  cash NUMERIC NOT NULL
);

CREATE TABLE stock_holdings (
  portfolio_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  ticker TEXT NOT NULL,
  quantity INTEGER NOT NULL
);

