CREATE DATABASE user_accounts;

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  user_firstName TEXT,
  user_lastName TEXT
);