CREATE DATABASE user_accounts;

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  account_status VARCHAR(20) NOT NULL
);