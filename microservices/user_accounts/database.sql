CREATE DATABASE user_accounts;

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  user_first_name TEXT,
  user_last_name TEXT
);