CREATE DATABASE matched_orders

CREATE TABLE matched_orders (
    matched_order_id SERIAL PRIMARY KEY,
    buy_order_id TEXT NOT NULL REFERENCES stock_orders(order_id),
    sell_order_id TEXT NOT NULL REFERENCES stock_orders(order_id),
    matched_time TIMESTAMP NOT NULL
);