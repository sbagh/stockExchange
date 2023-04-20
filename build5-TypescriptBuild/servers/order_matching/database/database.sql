CREATE DATABASE matched_orders

CREATE TABLE matched_orders (
    matched_order_id SERIAL PRIMARY KEY,
    buy_order_id TEXT NOT NULL ,
    sell_order_id TEXT NOT NULL ,
    matched_time TIMESTAMP NOT NULL
);