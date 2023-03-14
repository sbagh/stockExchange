CREATE DATABASE user_portfolio;

CREATE TABLE cash_holdings (
  portfolio_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES user_accounts_replica(user_id),
  cash NUMERIC NOT NULL
);

CREATE TABLE stock_holdings (
  portfolio_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES user_accounts_replica(user_id),
  ticker TEXT NOT NULL,
  quantity INTEGER NOT NULL
);

CREATE TABLE user_accounts_replica (
  user_id INTEGER NOT NULL,
  account_status VARCHAR(20) NOT NULL
)
