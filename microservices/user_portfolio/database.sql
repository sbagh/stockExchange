CREATE DATABASE user_portfolio;

CREATE TABLE cash_holdings (
  portfolio_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES user_accounts(user_id),
  cash NUMERIC NOT NULL
);

CREATE TABLE stock_holdings (
  portfolio_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES user_accounts(user_id),
  ticker TEXT NOT NULL,
  quantity INTEGER NOT NULL
);

